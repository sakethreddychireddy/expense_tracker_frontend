pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout the source code from your Git repository
                git url: 'https://github.com/sakethreddychireddy/expense_tracker_frontend', branch: 'main'
            }
        }
        stage('Deploy Docker Container') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile in the repository
                    sh 'docker compose up -d --build'
                }
            }
        }
    }
}