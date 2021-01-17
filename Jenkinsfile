pipeline {
    agent any
    options {
        disableConcurrentBuilds()
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/SirSkaro/Cook-Book-Client.git'
            }
        }
        stage('Build') {
            steps {
                configFileProvider([configFile(fileId: '23250c9a-a573-4d86-9afa-163a6aa03a2c', targetLocation: '.env.local')]) {}
                sh 'docker build -t cookbook-client .'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker stop cookbook-client || true && docker rm cookbook-client || true'
                withCredentials([string(credentialsId: 'e6484059-0aa9-45ca-a270-e8d2ae719ecc', variable: 'serverName')]) {
                    sh 'docker run -d \
                        --expose 80 \
                        --network casa-net \
                        --name cookbook-client \
                        --restart always \
                        -e VIRTUAL_HOST=$serverName \
                        cookbook-client'
                }
            }
        }
    }
}


        