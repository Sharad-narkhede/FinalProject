package testcases;

import java.io.IOException;
import java.util.List;

import org.openqa.selenium.WebDriver;

import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import base.Base;
import pages.HomePage;
import utility.StoreYearOnYearData;


public class HomeLoanTest extends Base {
	 HomePage homePage;
	 StoreYearOnYearData writeExcel;
	
	    @Parameters("browser")
		@BeforeClass
		public void configBrowser(String browser) throws IOException {
		setupBrowser(browser);
		}
	    
	@BeforeMethod
	public void HomePageObj() {
	 homePage = new  HomePage(driver);
	}
	
	@BeforeMethod
	public void WriteExcelClass() {
		writeExcel = new  StoreYearOnYearData();
	}
	@Test
	public void  chekDefaultCarLoanEMIValues()throws InterruptedException {
		homePage.clickOnHomeLoan();
	Assert.assertEquals(homePage.loanAmountInputBox(),prop.getProperty("homeLoanAmountCheck"),prop.getProperty("msg"));
	Assert.assertEquals(homePage.loanInterestInputBox(),prop.getProperty("homeLoanInterestCheck"),prop.getProperty("msg"));
	Assert.assertEquals(homePage.loantermInputBox(),prop.getProperty("homeLoanTenure"),prop.getProperty("msg"));
	}
	@Test
	public void  enterHomeLoanAmount()throws InterruptedException {
		homePage.clickOnHomeLoan();
		homePage. enterLoanAmount(prop.getProperty("homeLoanAmountEnter"));
		homePage.selectLoanInterestRate(Integer.parseInt(prop.getProperty("homeLoanInterstEnter")));
		homePage.selectLoanTenure(Integer.parseInt(prop.getProperty("homeLoanTenureEnter")));
	}
	
	@Test
	public void EnterNegativeValues() throws InterruptedException {
		homePage.clickOnHomeLoan();
		String loanAmount=prop.getProperty("homeLoanNegativeAmount");
		homePage. enterLoanAmount(loanAmount);
		homePage.selectLoanInterestRate(Integer.parseInt(prop.getProperty("homeLoanInterstEnter")));
		homePage.selectLoanTenure(Integer.parseInt(prop.getProperty("homeLoanTenureEnter")));
		Assert.assertFalse(loanAmount.equals(homePage.loanAmountInputBox()));
	}
	@Test(enabled=false)
	public void checkLoanEMIAndInterestPayable() throws InterruptedException {
		homePage.clickOnHomeLoan();
		homePage. enterLoanAmount(prop.getProperty("homeLoanAmountEnter"));
		homePage.selectLoanInterestRate(Integer.parseInt(prop.getProperty("homeLoanInterstEnter")));
		homePage.selectLoanTenure(Integer.parseInt(prop.getProperty("homeLoanTenureEnter")));
		Assert.assertEquals(homePage.getEMIvalue(),prop.getProperty("checkEMiValueHome"),prop.getProperty("msg"));
		Assert.assertEquals(homePage.getInterestPayableAmount(),prop.getProperty("interestPayavalHome"),prop.getProperty("msg"));	
	}
	@Test()
	public void extractDataYear() throws InterruptedException{
		homePage.clickOnHomeLoan();
		homePage. enterLoanAmount(prop.getProperty("homeLoanAmountEnter"));
		homePage.selectLoanInterestRate(Integer.parseInt(prop.getProperty("homeLoanInterstEnter")));
		homePage.selectLoanTenure(Integer.parseInt(prop.getProperty("homeLoanTenureForYOnY")));
		List<String> data=homePage.yearData();
		Assert.assertTrue(data.size()>0);
		writeExcel.getData(data);
	}
	@AfterClass
	public void CloseBrowser() {
		tearDown();
	}
}
