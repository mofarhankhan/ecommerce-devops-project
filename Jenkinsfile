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
    }
}