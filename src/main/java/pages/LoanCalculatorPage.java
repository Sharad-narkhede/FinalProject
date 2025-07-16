package pages;

import java.time.Duration;
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

public class LoanCalculatorPage {
	WebDriver driver;
	WebDriverWait wait;
	JavascriptExecutor js;
	Actions action;
	public  LoanCalculatorPage(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(driver, this);
		wait=new WebDriverWait(driver,Duration.ofSeconds(10));
		action = new Actions(driver);
		js = (JavascriptExecutor) driver;
	}
	@FindBy(id="menu-item-dropdown-2696")
	WebElement dropdown;
	
	@FindBy(linkText="Loan Calculator")
	WebElement loanCalculatorOption;
	
	@FindBy(xpath="(//a[@class='hidden-ts'])[1]")
	WebElement emiCalculator;
	@FindBy(xpath="(//a[@class='hidden-ts'])[2]")
	WebElement loanCalculator;
	@FindBy(xpath="(//a[@class='hidden-ts'])[3]")
	WebElement loanTenureCal;
	
	@FindBy(xpath="//div[@id='loancalculatordashboard']//input[@class='form-control']")
	List<WebElement> inputBox;
	
	@FindBy(xpath="//span[@class='ui-slider-handle ui-corner-all ui-state-default']")
	List<WebElement> sliders;
	@FindBy(xpath="//div[@id='loantermsteps']//span[@class='marker']")
	List<WebElement> yearScale;
	
	@FindBy(xpath="(//label[@class='btn btn-secondary'])[1]")
	WebElement loanMonth;
	public void NevigateToLoneCalculator() {
		dropdown.click();
		loanCalculatorOption.click();
	}
	public void clickOnEmiCalculator() {
		emiCalculator.click();
	}
	public void clickOnloanCalculator() {
		
loanCalculator.click();
	}
	public void clickOnTenureCalculator() {
		loanTenureCal.click();;
	}
	public boolean listOfInputBox() {
		boolean check = true;
		for(WebElement e:inputBox) {
		 check=e.isEnabled();
			if (check==false) {
				break;
			}
		}
		return check;
	}
	public boolean checkSliderEmi() {
		boolean check = true;
		int count=0;
		for(WebElement slider:sliders) {
			if(count!=1) {
			action.dragAndDropBy(slider, 0, 0).build().perform();
			
			action.dragAndDropBy(slider,50, 0);
			
			String value=slider.getAttribute("Style");
			
			if(value.equals("left: 0%;")) {
				check=false;
				break;
			}
			}
			count++;
		}
		return check;
	}
	
	public boolean checkSliderloan() {
		boolean check = true;
		int count=0;
		for(WebElement slider:sliders) {
			if(count!=0) {
			action.dragAndDropBy(slider, 0, 0).build().perform();
			action.dragAndDropBy(slider,50, 0);
			String value=slider.getAttribute("Style");
			if(value.equals("left: 0%;")) {
				check=false;
				break;
			}
			}
			count++;
		}
		return check;
	}
	
	
	public boolean checkSliderTenure() {
		boolean check = true;
		int count=0;
		for(WebElement slider:sliders) {
			if(count!=3) {
			action.dragAndDropBy(slider, 0, 0).build().perform();
			action.dragAndDropBy(slider,50, 0);
			String value=slider.getAttribute("Style");
			if(value.equals("left: 0%;")) {
				check=false;
				break;
			}
			}
			count++;
		}
		return check;
	}
	
	public boolean changeYearToMonth() {
		wait.until(ExpectedConditions.elementToBeClickable(loanMonth)).click();
		boolean check= true;
		List<WebElement> monthScale=driver.findElements(By.xpath("//div[@id='loantermsteps']//span[@class='marker']"));
		String[] yearValue= new String[yearScale.size()];
		int index=0;
		String[] monthValue= new String[monthScale.size()];
		for(WebElement year:yearScale) {
			yearValue[index]=year.getText();
			index++;
		}
		
		index=0;
		for(WebElement month:monthScale) {
			yearValue[index]=month.getText();
			index++;
		}
		for(int i=1;i<yearValue.length;i++) {
			if(yearValue[i].equals(monthValue)) {
				check=false;
			}
			
		}
		return check;
		}
	
	
}
