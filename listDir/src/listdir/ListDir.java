/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package listdir;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 *
 * @author rfbrady
 */
public class ListDir {

    /**
     * @param args the command line arguments
     * @throws java.io.IOException
     */
    public static void main(String[] args) throws IOException {
        BufferedWriter writer = null;
        // TODO code application logic here
        File curDir = new File(".");
        File htmlPage = new File(".","htmlFile.txt");
        try {
            writer = new BufferedWriter(new FileWriter(htmlPage));
        } catch (IOException e) {}
        writer.write("hello world");
        System.out.println(curDir.getAbsoluteFile());
        getAllFiles(curDir, writer);
        
    }
    public static void getAllFiles(File curDir, BufferedWriter writer) throws IOException{
        
        File[] fileList = curDir.listFiles();
        for(File f : fileList){
            if(f.isDirectory()){
                writer.write(f.getName());
                getAllFiles(f,writer);
                
            }
            if(f.isFile()){
                System.out.println(f.getName());
                writer.write(f.getName());
                
            }
        }
    }
    
    public static void writeHtml(File htmlPage){
        
    }
}
