package testcases;

import java.io.IOException;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;
import base.Base;
import pages.LoanCalculatorPage;



public class UIFunctionalityCheckOfEmiCalculatorTest extends Base{
	//WebDriver driver;
	LoanCalculatorPage loanCalculator;
	@Parameters("browser")
	@BeforeClass
	public void confiBrowser(String browser) throws IOException {
	setupBrowser(browser);
	}
	
	@BeforeMethod
	public void loanCalculatorObj() {
		loanCalculator = new  LoanCalculatorPage(driver);
		loanCalculator.NevigateToLoneCalculator();
	}
	
	@Test
	public void checkInputBoxIsEnable() {
		loanCalculator.clickOnEmiCalculator();
		boolean condition=loanCalculator.listOfInputBox();
		Assert.assertTrue(condition,prop.getProperty("buttonMsg"));	
	}
	
	@Test
	public void checkSliderMoveOrNot() {
		loanCalculator.clickOnEmiCalculator();
		Assert.assertTrue(loanCalculator.checkSliderEmi());
	}
	@Test
	public void checkScaleChange() {
		
		loanCalculator.clickOnEmiCalculator();
		//System.out.println(loanCalculator.changeYearToMonth());
	Assert.assertTrue(loanCalculator.changeYearToMonth());
	}
	
	@AfterClass
	public void CloseBrowser() {
		tearDown();
	}
	
}
