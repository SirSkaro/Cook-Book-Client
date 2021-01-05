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
                sh 'docker run -d \
                	-p 1963:8080 \
                	--network casa-net \
                	--name cookbook-client \
                	--restart always \
                	cookbook-client'
            }
        }
    }
}


        