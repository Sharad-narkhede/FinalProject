package utility;


import java.io.FileOutputStream;
import java.util.List;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class StoreYearOnYearData {

public void getData(List<String> dataList){
	XSSFWorkbook book= new XSSFWorkbook();
	XSSFSheet sheet=book.createSheet("FirstSheet");
	int rowNum=0;
	int cellNum=0;
	XSSFRow row =null;
	for(String data:dataList) {
		if(data.equals("Jan")||data.equals("Feb")||data.equals("Mar")||data.equals("Apr")||data.equals("May")||data.equals("Jun")||data.equals("Jul")||data.equals("Aug")||data.equals("Sep")||data.equals("Oct")||data.equals("Nov")||data.equals("Dec")){
			 row = sheet.createRow(++rowNum);
			cellNum=0;
			row.createCell(cellNum).setCellValue(data); 
		}else {
			row.createCell(++cellNum).setCellValue(data);
		}
		
	}
	try {
		FileOutputStream file = new FileOutputStream("C:\\Users\\2407323\\OneDrive - Cognizant\\Desktop\\myfile.xlsx");
		book.write(file);
		file.close();
	}catch(Exception e) {
		System.out.println("not showing");
	}	
}
}
