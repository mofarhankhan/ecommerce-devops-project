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
        stage('Security Scan Docker Images') {
            steps {
                sh """
                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    mofarhankhann/ecommerce-backend:${BUILD_NUMBER}

                    trivy image \
                    --severity HIGH,CRITICAL \
                    --exit-code 1 \
                    mofarhankhann/ecommerce-frontend:${BUILD_NUMBER}
                """
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
        stage('Deploy To Kubernetes'){
            steps{
                sh """
                    ssh makk@192.168.1.11 '
                        kubectl set image deployment/backend-deployment \
                        backend=mofarhankhann/ecommerce-backend:${BUILD_NUMBER} \
                        -n devops-app

                        kubectl set image deployment/frontend-deployment \
                        frontend=mofarhankhann/ecommerce-frontend:${BUILD_NUMBER} \
                        -n devops-app
                    '
                """
            }
        }
        stage('Verify Kubernetes Deployment') {
            steps {
                script {
                    try {

                        sh """
                            ssh makk@192.168.1.11 "
                                kubectl rollout status deployment/backend-deployment \
                                -n devops-app \
                                --timeout=120s

                                kubectl rollout status deployment/frontend-deployment \
                                -n devops-app \
                                --timeout=120s
                            "
                        """

                    } catch (Exception e) {

                        echo "Kubernetes deployment failed!"
                        echo "Starting automatic rollback..."

                        sh """
                            ssh makk@192.168.1.11 "
                                kubectl rollout undo deployment/backend-deployment \
                                -n devops-app

                                kubectl rollout undo deployment/frontend-deployment \
                                -n devops-app
                            "
                        """

                        error("Deployment failed. Previous version restored.")
                    }
                }
            }
        }
        stage('Application Health Check') {
            steps {
                sh """
                    ssh makk@192.168.1.11 "
                        kubectl run health-check-${BUILD_NUMBER} \
                        --rm \
                        -i \
                        --restart=Never \
                        --image=curlimages/curl:8.10.1 \
                        -n devops-app \
                        -- \
                        curl -f http://backend-service:5000/
                    "
                """
            }
        } 
    }
}
