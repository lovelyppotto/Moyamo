pipeline {
    agent any

    triggers {
        gitlab(
            triggerOnPush: true,
            branchFilterType: 'NameBasedFilter',
            includeBranchesSpec: 'fe/develop'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build React Docker Image') {
            steps {
                sh 'docker build -t react-app-image -f Dockerfile .'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
}
