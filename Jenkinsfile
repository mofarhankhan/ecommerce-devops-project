pipeline{
    agent any

    stages{
        stage('Checkout'){
            steps{
                checkout scm
            }
        }
        stage('Verify Workspace'){
            steps{
                sh 'pwd'
                sh 'ls -la'
            }
        }
        stage('Install Backend Dependencies'){
            steps{
                dir('backend'){
                    sh 'npm ci'
                }
            }
        }
        stage('Test Backend'){
            steps{
            dir('backend'){
                sh 'npm test'
            }
            }
        }
        stage('Build Backend Docker Image'){
            steps{
            sh '''
                docker build \
                -t mofarhankhann/ecommerce-backend:${BUILD_NUMBER} \
                -t mofarhankhann/ecommerce-backend:latest \
                ./backend
            '''
            }
        }
        stage('Build Frontend Docker Image'){
            steps{
            sh '''
                docker build \
                -t mofarhankhann/ecommerce-frontend:${BUILD_NUMBER} \
                -t mofarhankhann/ecommerce-frontend:latest \
                ./frontend
            '''
            }
        }
        stage('Push Backend Image'){
            steps{
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_PASSWORD'
                    )
                ]){
                    sh '''
                        echo "$DOCKERHUB_PASSWORD" | docker login \
                        -u "$DOCKERHUB_USERNAME" \
                        --password-stdin

                        docker push mofarhankhann/ecommerce-backend:${BUILD_NUMBER}
                        docker push mofarhankhann/ecommerce-backend:latest
                    '''
                }
            }
        }
        
        stage('Push Frontend Image'){
        steps{
            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )
            ]){
                sh '''
                    docker push mofarhankhann/ecommerce-frontend:${BUILD_NUMBER}
                    docker push mofarhankhann/ecommerce-frontend:latest
                '''
            }
        }
    }
    }
}
