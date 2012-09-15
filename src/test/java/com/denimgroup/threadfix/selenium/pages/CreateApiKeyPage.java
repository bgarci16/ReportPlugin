////////////////////////////////////////////////////////////////////////
//
//     Copyright (c) 2009-2011 Denim Group, Ltd.
//
//     The contents of this file are subject to the Mozilla Public License
//     Version 1.1 (the "License"); you may not use this file except in
//     compliance with the License. You may obtain a copy of the License at
//     http://www.mozilla.org/MPL/
//
//     Software distributed under the License is distributed on an "AS IS"
//     basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
//     License for the specific language governing rights and limitations
//     under the License.
//
//     The Original Code is Vulnerability Manager.
//
//     The Initial Developer of the Original Code is Denim Group, Ltd.
//     Portions created by Denim Group, Ltd. are Copyright (C)
//     Denim Group, Ltd. All Rights Reserved.
//
//     Contributor(s): Denim Group, Ltd.
//
////////////////////////////////////////////////////////////////////////
package com.denimgroup.threadfix.selenium.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class CreateApiKeyPage extends BasePage {

	private WebElement notes;
	private WebElement restrictedCheckBox;
	private WebElement createButton;
	private WebElement backToListLink;

	public CreateApiKeyPage(WebDriver webDriver) {
		super(webDriver);
		notes = driver.findElementById("note");
		restrictedCheckBox = driver.findElementById("isRestrictedKey1");
		createButton = driver.findElementById("createApiKeyButton");
		backToListLink = driver.findElementByLinkText("Back to API Key Index");
	}

	public void setNotes(String Status) {
		notes.clear();
		notes.sendKeys(Status);
	}

	public void clickCreate() {
		createButton.click();
		sleep(1000);
	}

	public void clickBackToListLink() {
		backToListLink.click();
		sleep(1000);
	}

	public void setRestrictCheckBoxValue(Boolean isRestChkBox) {

		if (getRestrictCheckBox().isSelected() && !isRestChkBox)

			getRestrictCheckBox().click();

		else if (!getRestrictCheckBox().isSelected() && isRestChkBox)

			getRestrictCheckBox().click();

	}

	public void setRestrictCheckBox(WebElement restrictedBox) {
		restrictedCheckBox = restrictedBox;
	}

	public WebElement getRestrictCheckBox() {
		return restrictedCheckBox;
	}

	public void fillAllClickSave(boolean restrictedBox) {
		fillRequired();
		setRestrictCheckBoxValue(restrictedBox);
		createButton.click();
		sleep(1000);
	}

	public void fillRequired() {

	}

}