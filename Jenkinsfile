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
                echo "🧭 Checking for existing containers using port 3000..."
                docker ps -q --filter "publish=3000" | xargs -r docker stop || true
                docker ps -aq --filter "publish=3000" | xargs -r docker rm || true
                echo "Checking for existing container named react_app_container..."
                if [ "$(docker ps -aq -f name=react_app_container)" ]; then
                    echo "📦 Stopping existing container..."
                    docker stop react_app_container || true

                    TIMESTAMP=$(date +"%Y%m%d%H%M%S")
                    ARCHIVE_NAME="react_app_container_${TIMESTAMP}"
                    echo "🗄️ Archiving old container as: $ARCHIVE_NAME"
                    docker rename react_app_container $ARCHIVE_NAME || true
                fi

                echo "🧹 Cleaning up dangling images..."
                docker image prune -f || true

                echo "🚀 Running new container..."
                docker run -d -p 3000:80 --name react_app_container ${DOCKER_IMAGE}:latest

                echo "✅ Deployment complete!"
            '''
        }
    }
}

    }

    post {
        success {
            echo "✅ Deployment successful! Your app is live"
        }
        failure {
            echo "❌ Build or deployment failed. Check Jenkins logs for details."
        }
    }
}
