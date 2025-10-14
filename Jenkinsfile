pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'expense_tracker/react-frontend'
        BRANCH_NAME = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                git branch: "${BRANCH_NAME}",
                    url: 'https://github.com/sakethreddychireddy/expense_tracker_frontend.git',
                    credentialsId: 'github-access-token'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                echo '🏗️ Building React app...'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    sh "docker build --network=host -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                    sh "docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                echo '🚀 Deploying container...'
                script {
                    sh '''
                        docker ps -q --filter "name=react_app_container" | grep -q . && \
                        docker stop react_app_container && docker rm react_app_container || true

                        docker run -d -p 3000:80 --name react_app_container ${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Your app is live at: http://:3000"
        }
        failure {
            echo "❌ Build or deployment failed. Check Jenkins logs for details."
        }
    }
}
