pipeline {
    agent any

    stages {
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