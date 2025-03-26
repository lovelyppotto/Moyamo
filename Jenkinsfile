pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    triggers {
        GenericTrigger(
            causeString: 'Triggered by GitLab',
            token: 'react-deploy-token',
            regexpFilterText: '$ref',
            regexpFilterExpression: 'refs/heads/fe/develop'
        )
    }

    stages {
        stage('Manual Git Checkout') {
            steps {
                // 수동 clone만 수행
                git branch: 'fe/develop',
                    url: 'https://lab.ssafy.com/s12-ai-image-sub1/S12P21D203.git',
                    credentialsId: 'gitlab-credential-id'
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    dir('FE') {
                        sh 'docker compose down -v react || true'
                        sh 'docker compose up -d --build react'
                    }
                }
            }
        }
    }
}
