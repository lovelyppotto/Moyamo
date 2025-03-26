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
        stage('Build and Deploy') {
            steps {
                script {
                    dir('./FE') {
                        sh 'docker compose down -v react'
                        sh 'docker compose up -d --build react'
                    }
                }
            }
        }
    }
}
