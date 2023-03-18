package com.nxtgen.helloworld.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
public class HomeController {
    
    @RequestMapping("/ingress")
    String ingress() {
        String message =  "";
        
        //try {
            // Local address
            //String ip = InetAddress.getLocalHost().getHostAddress();
            //String host = InetAddress.getLocalHost().getHostName();

            // Remote address
            //String rip = InetAddress.getLoopbackAddress().getHostAddress();
            //String rhost = InetAddress.getLoopbackAddress().getHostName();
            
            //message = "Hello from NextGen! --> V6 --> ingress. Local Server ip --> "+ip+ " Local Server Name --> "+host+" Remote Server ip --> "+rip+ " Remote Server Name --> "+rhost;
            message = "Hello from AWengerS! --> V7 ";
            
            System.out.println(message);
            
        //} catch (UnknownHostException e) {
          //  e.printStackTrace();
        //}
        
        return message;
    }

    @RequestMapping("/home")
    String home() {
        String message =  "";
        
        try {
            // Local address
            String ip = InetAddress.getLocalHost().getHostAddress();
            String host = InetAddress.getLocalHost().getHostName();

            // Remote address
            String rip = InetAddress.getLoopbackAddress().getHostAddress();
            String rhost = InetAddress.getLoopbackAddress().getHostName();
            
            message = "Hello from NextGen! --> V6 --> home. Local Server ip --> "+ip+ " Local Server Name --> "+host+" Remote Server ip --> "+rip+ " Remote Server Name --> "+rhost;
            
            System.out.println(message);
            
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        
        return message;
    }

}
