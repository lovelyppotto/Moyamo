pipeline {
  agent any
  environment {
    EC2_IP = "43.201.250.82"                     # EC2 인스턴스 IP
    DOCKER_NETWORK = "nginx_jenkins_network"    # Docker 네트워크 이름
    CURRENT_COLOR = "blue"                      # 배포 기본값
  }
  stages {
    // GitLab에서 코드 체크아웃
    stage('Checkout') {
      steps {
        git branch: 'fe/develop', 
             url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D203.git',
             credentialsId: 'gitlab-credential-id'
      }
    }

    // Docker 이미지 빌드 (Blue/Green 결정)
    stage('Build Image') {
      steps {
        script {
          // 현재 활성화된 컬러 확인
          def activeColor = sh(script: """
            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} \
            "docker inspect --format='{{.State.Status}}' react-blue || echo 'green'"
          """, returnStdout: true).trim()
          
          env.CURRENT_COLOR = (activeColor == "running") ? "blue" : "green"
          env.NEW_COLOR = (env.CURRENT_COLOR == "blue") ? "green" : "blue"

          // 새 Docker 이미지 빌드
          sh "docker build -t react-app:${env.NEW_COLOR} ."
        }
      }
    }

    // EC2에 새 컨테이너 배포
    stage('Deploy New Color') {
      steps {
        sshagent(['ec2-ssh-key-id']) {
          sh """
            // 새 컨테이너 실행
            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} \
                "docker run -d --name react-${env.NEW_COLOR} \
                --network ${DOCKER_NETWORK} \
                react-app:${env.NEW_COLOR}"

            // 헬스 체크
            retry(5) {
              sleep 10
              ssh ubuntu@${EC2_IP} \
                  "curl -sSf http://react-${env.NEW_COLOR}:80/health"
            }
          """
        }
      }
    }

    // Nginx 트래픽 전환
    stage('Switch Traffic') {
      steps {
        sshagent(['ec2-ssh-key-id']) {
          sh """
            // Nginx 설정 변경
            ssh ubuntu@${EC2_IP} \
                "sed -i 's/server react-${env.CURRENT_COLOR}:80/server react-${env.NEW_COLOR}:80/g' \
                /home/ubuntu/nginx-data/nginx/default.conf"

            // Nginx 무중단 리로드
            ssh ubuntu@${EC2_IP} \
                "docker exec nginx nginx -s reload"
          """
        }
      }
    }

    // 이전 컨테이너 정리
    stage('Cleanup') {
      steps {
        sshagent(['ec2-ssh-key-id']) {
          sh """
            ssh ubuntu@${EC2_IP} \
                "docker stop react-${env.CURRENT_COLOR} || true && \
                 docker rm react-${env.CURRENT_COLOR} || true"
          """
        }
      }
    }
  }

  post {
    failure {
      echo "Pipeline failed! Check the logs."
    }
  }
}