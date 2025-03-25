pipeline {
    agent any

    triggers {
        GenericTrigger(
            causeString: 'Triggered by GitLab',
            token: 'react-deploy-token',
            regexpFilterText: '$ref',
            regexpFilterExpression: 'refs/heads/fe/develop'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'fe/develop', 
                    credentialsId: 'gitlab-credential-id', 
                    url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D203.git'
            }
        }
        stage('Build and Deploy') {
            steps {
                script {
                    dir('/path/to/react-project') {
                        sh 'git pull origin fe/develop'
                        sh 'docker compose down -v react'
                        sh 'docker compose up -d --build react'
                    }
                }
            }
        }
    }
}