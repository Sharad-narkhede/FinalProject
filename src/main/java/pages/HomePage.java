package pages;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HomePage {
WebDriver driver;
WebDriverWait wait;
JavascriptExecutor js;
Actions action;
public  HomePage(WebDriver driver) {
	this.driver = driver;
	PageFactory.initElements(driver, this);
	wait=new WebDriverWait(driver,Duration.ofSeconds(10));
	action = new Actions(driver);
	js = (JavascriptExecutor) driver;
	
	
//	String hubUrl="http://10.193.74.255:4444/wd/hub";
//	DesiredCapabilities cap = new DesiredCapabilities();
//	cap.setPlatform(Platform.WINDOWS);
//	cap.setBrowserName("chrome");
//	 this.driver=new RemoteWebDriver(new URL(hubUrl),(cap)); 
}


@FindBy(id="car-loan")
WebElement carLoan;

@FindBy(id="home-loan")
WebElement homeLone;

@FindBy(id="loanamount")
WebElement loanAmount;

@FindBy(xpath="(//span[@class='ui-slider-handle ui-corner-all ui-state-default'])[2]")
WebElement loanInterestSlider;

@FindBy(id="loaninterest")
WebElement loanInterest;

@FindBy(xpath="(//span[@class='ui-slider-handle ui-corner-all ui-state-default'])[3]")
WebElement loanTermSlider;

@FindBy(id="loanterm")
WebElement loanterm;

@FindBy(xpath="//div[@id='emiamount']//span")
WebElement loanEMI;

@FindBy(xpath="//div[@id='emitotalinterest']//span")
WebElement totalInterestPayable;


@FindBy(xpath="//div[@id='emipaymenttable']//tr[@class='row no-margin']/td")
List<WebElement> yearData;
@FindBy(xpath="//td[@class='col-2 col-lg-1 paymentyear toggle']")
List<WebElement> perYear;


public void clickOnCarLoan() {
	driver.navigate().refresh();
	carLoan.click();
}
public void clickOnHomeLoan() {
	driver.navigate().refresh();
	homeLone.click();
}
public String loanAmountInputBox() throws InterruptedException {
	return loanAmount.getAttribute("value");
}
public String loanInterestInputBox() {
	return loanInterest.getAttribute("value");
}

public String loantermInputBox() {
	return loanterm.getAttribute("value");	
} 

public void enterLoanAmount(String amount) throws InterruptedException{
	loanAmount.click();
	loanAmount.clear();
	loanAmount.sendKeys(amount);
	loanAmount.click();
}


public void selectLoanInterestRate(int x) throws InterruptedException {
	wait.until(ExpectedConditions.visibilityOf(loanInterestSlider));
	action.dragAndDropBy(loanInterestSlider,x,0).build().perform();
	
}
public void selectLoanTenure(int x) throws InterruptedException {
	loanterm.click();
    loanterm.clear();
	loanterm.click();
	js.executeScript("window.scrollBy(0,200)");
	wait.until(ExpectedConditions.visibilityOf(loanTermSlider));
	action.dragAndDropBy(loanTermSlider,x,0).build().perform();
}
public String getEMIvalue() {
	js.executeScript("window.scrollBy(0,500)");
	wait.until(ExpectedConditions.visibilityOf(loanEMI));
	System.out.println("Payable EMI Amount : "+loanEMI.getText());
	return loanEMI.getText();
	
}

public String getInterestPayableAmount() {
	System.out.println("Total Interest Payable : "+totalInterestPayable.getText());
	js.executeScript("arguments[0].scrollIntoView(true);",totalInterestPayable);
	wait.until(ExpectedConditions.visibilityOf(totalInterestPayable));
	return totalInterestPayable.getText();
}

public List<String> yearData(){
	int scroll=0;
	js.executeScript("window.scrollBy(0,1200)");
	List<String> list = new ArrayList<>();
	int i=1;
	for(WebElement year:perYear) {
		js.executeScript("window.scrollBy(0,scroll)");
		wait.until(ExpectedConditions.elementToBeClickable(year)).click();
	
		List<WebElement> tables=driver.findElements(By.xpath("(//td[@class='col-12 monthyearwrapper'])["+i+"]//td"));
		for(WebElement e:tables) {
		list.add(e.getText());
	}
		scroll=scroll+200;
		i++;
	}
	
	wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath("//div[@id='emipaymenttable']//tr[@class='row no-margin']/td")));
	return list;
}



}
