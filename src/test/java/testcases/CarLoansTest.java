package testcases;
import java.io.IOException;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import base.Base;
import pages. HomePage;

public class CarLoansTest extends Base {
	 HomePage homePage;
	
	 @Parameters("browser")
		@BeforeClass
		public void confiBrowser(String browser) throws IOException {
		setupBrowser(browser);
		}
	
	@BeforeMethod
	public void HomePageObj() {
	 homePage = new HomePage(driver);
	}
	@Test
	public void  chekDefaultCarLoanEMIValues()throws InterruptedException {
		homePage.clickOnCarLoan();
	Assert.assertEquals(homePage.loanAmountInputBox(),prop.getProperty("carLoanAmountcheck"),prop.getProperty("msg"));
	Assert.assertEquals(homePage.loanInterestInputBox(),prop.getProperty("carLoanInterestCheck"),prop.getProperty("msg"));
	Assert.assertEquals(homePage.loantermInputBox(),prop.getProperty("carLoanTenureCheck"),prop.getProperty("msg"));
	}
	
	@Test
	public void  enterCarLoanAmount()throws InterruptedException {
		homePage.clickOnCarLoan();
		homePage.enterLoanAmount(prop.getProperty("carLoanAmountEnter"));
		homePage.selectLoanInterestRate(Integer.parseInt(prop.getProperty("carLoanInterestEnter")));
		homePage.selectLoanTenure(Integer.parseInt(prop.getProperty("carLoanTenureEnter")));
	}
	@Test
	public void EnterNegativeValues() throws InterruptedException {
		homePage.clickOnCarLoan();
		String loanAmount=prop.getProperty("carLoanNegativeAmount");
		homePage. enterLoanAmount(loanAmount);
		homePage.selectLoanInterestRate(Integer.parseInt(prop.getProperty("carLoanInterestEnter")));
		homePage.selectLoanTenure(Integer.parseInt(prop.getProperty("carLoanTenureEnter")));
		Assert.assertFalse(loanAmount.equals(homePage.loanAmountInputBox()));
	}
	
	@Test
	public void checkLoanEMIAndInterestPayable() throws InterruptedException {
		homePage.clickOnCarLoan();
		homePage. enterLoanAmount(prop.getProperty("carLoanAmountEnter"));
		homePage.selectLoanInterestRate(Integer.parseInt(prop.getProperty("carLoanInterestEnter")));
		homePage.selectLoanTenure(10);
		Assert.assertEquals(homePage.getEMIvalue(),prop.getProperty("checkEmiValueCar"),prop.getProperty("msg"));
		Assert.assertEquals(homePage.getInterestPayableAmount(),prop.getProperty("interestPayabalCar"),prop.getProperty("msg"));
		
	}
	@AfterClass
	public void CloseBrowser() {
		tearDown();
	}
	
	
	
	
}
