pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "sseon701/moyamo-react"
        IMAGE_TAG = "latest"

        EC2_IP = credentials('EC2_IP')       
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
                    sshagent(credentials: [SSH_CREDENTIAL]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} "
                                docker pull ${DOCKER_IMAGE}:${IMAGE_TAG}
                                docker stop react || true
                                docker rm react || true
                                docker run -d --name react -p 80:80 ${DOCKER_IMAGE}:${IMAGE_TAG}
                            "
                        """
                    }
                }
            }
        }
    }
}
