pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'expense_tracker/react-frontend'
        BRANCH_NAME = 'main'   // Change if using another branch
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                git branch: "${main}", url: 'https://github.com/sakethreddychireddy/expense_tracker_frontend.git'
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
                    sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                }
            }
        }

        // stage('Push to Docker Hub') {
        //     steps {
        //         echo '📤 Pushing Docker image to Docker Hub...'
        //         script {
        //             withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //                 sh """
        //                     echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
        //                     docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
        //                     docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
        //                     docker push ${DOCKER_IMAGE}:latest
        //                 """
        //             }
        //         }
        //     }
        // }

        stage('Deploy Container') {
            steps {
                echo '🚀 Deploying container...'
                script {
                    // Stop and remove existing container if running
                    sh """
                        docker ps -q --filter "name=react_app_container" | grep -q . && docker stop react_app_container && docker rm react_app_container || true
                        docker run -d -p 3000:80 --name react_app_container ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! App is running at http://192.168.1.213:3000"
        }
        failure {
            echo "❌ Build or deployment failed!"
        }
    }
}
