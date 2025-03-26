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
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    dir('FE') {
                        sh 'docker-compose down -v react || true'
                        sh 'docker-compose up -d --build react'
                    }
                }
            }
        }
    }
}
