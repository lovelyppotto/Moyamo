pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "sseon701/moyamo-react"
        IMAGE_TAG = "latest"
        SSH_CREDENTIAL = 'ec2'
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'fe/develop',
                    url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D203.git',
                    credentialsId: 'gitlab-credential-id'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${IMAGE_TAG}", "./FE")
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub') {
                        docker.image("${DOCKER_IMAGE}:${IMAGE_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'EC2_IP', variable: 'EC2_IP')]) {
                        sshagent(credentials: [SSH_CREDENTIAL]) {
                            sh """
                                ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP '
                                    docker pull ${DOCKER_IMAGE}:${IMAGE_TAG}
                                    docker stop react || true
                                    docker rm react || true
                                    docker run -d --name react -p 80:80 ${DOCKER_IMAGE}:${IMAGE_TAG}
                                '
                            """
                        }
                    }
                }
            }
        }

        stage('Notify Success') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'FE-MATTERMOST', variable: 'MATTERMOST_WEBHOOK')]) {
                        sh """
                            curl -X POST -H 'Content-Type: application/json' -d '{
                                "text": ":rocket: *FE 배포 완료!*\\n브랜치: fe/develop\\n도커 이미지: ${DOCKER_IMAGE}:${IMAGE_TAG}"
                            }' $MATTERMOST_WEBHOOK
                        """
                    }
                }
            }
        }
    }

    post {
        failure {
            script {
                withCredentials([string(credentialsId: 'FE-MATTERMOST', variable: 'MATTERMOST_WEBHOOK')]) {
                    sh """
                        curl -X POST -H 'Content-Type: application/json' -d '{
                            "text": ":x: *FE 배포 실패!*\\n<@sunju701> 확인 부탁드립니다."
                        }' $MATTERMOST_WEBHOOK
                    """
                }
            }
        }
    }
}
