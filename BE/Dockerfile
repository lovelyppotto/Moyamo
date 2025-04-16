FROM openjdk:17

WORKDIR /app

COPY build/libs/BE-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "app.jar"]
