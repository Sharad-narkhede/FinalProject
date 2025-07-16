package base;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Properties;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.chrome.ChromeOptions;


public class Base {
    protected WebDriver driver;
    public Properties prop;

    public WebDriver setupBrowser(String browser) throws IOException {
        loadConfig();
        String gridHubUrl = prop.getProperty("hubURL");

        try {
            if (browser.equalsIgnoreCase("chrome")) {
            	
                ChromeOptions options = new ChromeOptions();
                driver = new RemoteWebDriver(new URL(gridHubUrl), options);
            }else {
                throw new RuntimeException("Browser not supported: " + browser);
            }

            driver.manage().window().maximize();
            driver.get(prop.getProperty("url"));
            return driver;

        } catch (Exception e) {
            System.out.println("Remote setup failed: " + e.getMessage());
            throw new RuntimeException("WebDriver initialization failed");
        }
    }

    public void loadConfig() throws IOException {
        prop = new Properties();
        FileInputStream file = new FileInputStream("config.properties");
        prop.load(file);
    }

    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}




































//without Selenium grid
//package base;
//
//import java.io.FileInputStream;
//
//import java.io.IOException;
//import java.util.Properties;
//
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.chrome.ChromeDriver;
//import org.openqa.selenium.edge.EdgeDriver;
//
//
//public class Base {
//	
//	protected WebDriver driver;
//	public Properties prop;
//	
//	
//	public WebDriver setupBrowser(String browser) throws IOException {
//		if(browser.equalsIgnoreCase("chrome")) {
//			data();
//		     driver= new ChromeDriver();
//		     driver.manage().window().maximize();
//				driver.get(prop.getProperty("url"));
//		}
//		else if(browser.equalsIgnoreCase("edge")) {
//			data();
//			  driver= new EdgeDriver();
//			  driver.manage().window().maximize();
//				driver.get(prop.getProperty("url"));
//		}
	
//		return driver;
//		
//	}
//
//	public void data() throws IOException {
//		prop= new Properties();
//		FileInputStream file = new FileInputStream("config.properties");
//		 prop.load(file);
//		
//	}
//	
//	
//	public void tearDown() {
//		driver.quit();
//	}
//}


//
//package base;
//
//import java.io.FileInputStream;
//import java.io.IOException;
//import java.net.URL;
//import java.util.Properties;
//
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.remote.RemoteWebDriver;
//import org.openqa.selenium.chrome.ChromeOptions;
//import org.openqa.selenium.edge.EdgeOptions;
//
//public class Base {
//  protected WebDriver driver;
//  public Properties prop;
//
//  public WebDriver setupBrowser(String browser) throws IOException {
//      loadConfig();
//
//      String gridHubUrl = prop.getProperty("hubURL");
//
//      if (browser.equalsIgnoreCase("chrome")) {
//          ChromeOptions options = new ChromeOptions();
//          driver = new RemoteWebDriver(new URL(gridHubUrl), options);
//      } else if (browser.equalsIgnoreCase("edge")) {
//          EdgeOptions options = new EdgeOptions();
//          driver = new RemoteWebDriver(new URL(gridHubUrl), options);
//      } else {
//          throw new RuntimeException("Unsupported browser: " + browser);
//      }
//
//      driver.manage().window().maximize();
//      driver.get(prop.getProperty("url"));
//      return driver;
//  }
//
//  public void loadConfig() throws IOException {
//      prop = new Properties();
//      FileInputStream file = new FileInputStream("config.properties");
//      prop.load(file);
//  }
//
//  public void tearDown() {
//      if (driver != null) {
//          driver.quit();
//      }
//  }
//}
//
