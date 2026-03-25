package com.instagram.clone;

import com.instagram.clone.model.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjectApplication {

	public static void main(String[] args) {
		User user = new User();
		user.setUsername("alex");
		System.out.println(user.getUsername());
		SpringApplication.run(ProjectApplication.class, args);
	}

}
