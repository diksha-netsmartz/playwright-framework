import {expect} from '@playwright/test';
import BasePage from "../utils/BasePage";


class NewStudentEnrollmentPage extends BasePage {

    constructor(page) {
        super(page);

        // Package
        this.packageSelectionButton = page.getByRole('button', {
            name: 'Package Selection'
        });

        this.addPackageButton = page.getByRole('button', {
            name: 'Add Package'
        });

        this.selectLocationDropdown = page.getByRole('link', {
            name: 'Select Location'
        });

        this.showAllCheckbox = page.getByText('Show All').first();

        this.filterButton = page.getByRole('button', {
            name: 'Filter'
        });

        this.selectButton = page.locator("xpath=//a[text()='Select' and @onclick='showAddButton(this);']").first();

        this.addButton = page.locator("xpath=//button[text()='Add' and contains(@onclick,'showSelect(this);')]").first();
        this.addButtonForAdditionalDetails = page.locator("xpath=//td[text()='Fee']//ancestor::tr//button[text()='Add' and contains(@onclick,'addAdditional')]").first();

        this.addToCartButton = page.getByRole('button', {
            name: 'Add To Cart'
        });

        // Student Information
        this.studentInformationType = page.getByRole('button', {
            name: 'Student Information Type'
        });

        this.firstName = page.getByRole('textbox', {
            name: 'First Name'
        });

        this.middleName = page.getByRole('textbox', {
            name: 'Middle Name'
        });

        this.lastName = page.getByRole('textbox', {
            name: 'Last Name'
        });

        this.address = page.getByRole('textbox', {
            name: 'Address'
        });

        this.city = page.locator('div').filter({hasText: 'Los Angeles CountyCA, USA'}).first();
        this.stateDropdown = page.locator("xpath=//button[@data-id='State']");
        this.stateOptionValue = page.locator('a').filter({hasText: 'AK'})

        this.zipCode = page.getByRole('textbox', {
            name: 'Zip Code'
        });

        this.studentCellPhone = page.getByRole('textbox', {
            name: 'Student Cell Phone'
        });

        this.studentEmail = page.getByRole('textbox', {
            name: 'Student Email'
        });

        this.parentName = page.getByRole('textbox', {
            name: 'Parent Name',
            exact: true
        });

        this.parentCellPhone = page.getByRole('textbox', {
            name: 'Parent Cell Phone'
        });

        this.parentEmail = page.getByRole('textbox', {
            name: 'Parent Email',
            exact: true
        });

        this.parentName2 = page.getByRole('textbox', {
            name: 'Parent Name 2'
        });

        this.parentPhone2 = page.getByRole('textbox', {
            name: 'Parent Phone'
        });

        this.parentEmail2 = page.getByRole('textbox', {
            name: 'Parent Email 2'
        });

        this.emergencyName = page.getByRole('textbox', {
            name: 'Emergency Name'
        });

        this.emergencyRelationship = page.getByRole('textbox', {
            name: 'Emergency Relationship'
        });

        this.emergencyPhone = page.getByRole('textbox', {
            name: 'Emergency Phone'
        });

        this.permitNumber = page.getByRole('textbox', {
            name: 'Permit #'
        });

        this.medicalConditions = page.locator('#MedicalConditions');

        this.studentNotes = page.locator('#StudentNotes');
        this.maleCheckbox = page.getByLabel('Male').first();

        this.drivingNotes = page.locator('#DrivingNotes');

        this.saveButton = page.getByRole('button', {
            name: 'Save'
        }).first();

        this.termsConditionsCheckbox = page.locator("xpath=//input[@id='TermsConditions']//parent::label//span");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        // Student DOB
        this.dobMonthDropdown = page.locator("xpath=//button[@data-id='int_DOB_Month']");

        this.dobMonth = page.locator("xpath=//button[@data-id='int_DOB_Month']//following-sibling::div//a//span[text()='Jun']");

        this.dobDayDropdown = page.locator("xpath=//button[@data-id='int_DOB_Day']");

        this.dobDay = page.locator("xpath=//button[@data-id='int_DOB_Day']//following-sibling::div//a//span[text()='01']");

        this.dobYearDropdown = page.locator("xpath=//button[@data-id='int_DOB_Year']");

        this.dobYear = page.locator("xpath=//button[@data-id='int_DOB_Year']//following-sibling::div//a//span[text()='2006']");
    }


    async selectPackage(packageName) {
        await this.packageSelectionButton.click();

        await this.page.getByRole('link', {
            name: packageName, exact: true
        }).click();
    }


    async selectLocation() {
        await this.selectLocationDropdown.click();
        await this.showAllCheckbox.click();

    }

    async selectDOB() {
        await this.page.getByRole('textbox', {
            name: 'MM/DD/YYYY'
        }).fill("12/12/2000");

        await this.filterButton.click();
        await this.selectButton.click();
        await this.addButton.click();
        await this.addToCartButton.click();
    }

    async addAdditionalDetails() {
        await this.addButtonForAdditionalDetails.click();
        await this.addToCartButton.click();
    }


    async addPackage(packageName) {

        await this.selectPackage(packageName);
        await this.click(this.addPackageButton);

        switch (packageName) {

            case 'BTW and CR Package':
            case 'CR Package':
                await this.selectLocation();
                await this.selectDOB();
                await this.addAdditionalDetails();
                await this.selectStudentType("Teen");
                break;

            case 'RT PAckage 1':
                await this.selectButton.click();
                await this.addButton.click();
                await this.addToCartButton.click();
                await this.addAdditionalDetails();
                await this.selectStudentType("Teen");
                break;

            case 'BTW Package':
                await this.addAdditionalDetails();
                await this.selectStudentType("Teen");
                break;

            default:
                throw new Error(
                    `Unsupported package: ${packageName}`
                );
        }
    }


    async selectStudentType(studentType) {
        await this.studentInformationType.click();

        await this.page.getByRole('link', {
            name: studentType
        }).click();
    }

    async fillStudentInformation(data) {

        await this.firstName.fill(data.firstName);
        await this.middleName.fill(data.middleName);
        await this.lastName.fill(data.lastName);

        await this.address.pressSequentially(data.address, {delay: 100});
        await this.click(this.city);
        await this.click(this.stateDropdown);
        await this.click(this.stateOptionValue);

        await this.address.fill(data.address);
        await this.zipCode.fill(data.zipCode);


        await this.studentCellPhone.fill(data.studentCellPhone);


        await this.studentEmail.fill(data.studentEmail);

        await this.parentName.fill(data.parentName);


        await this.parentCellPhone.fill(data.parentCellPhone);


        await this.parentEmail.fill(data.parentEmail);

        await this.parentName2.fill(data.parentName2);

        if (data.parentPhone2) {
            await this.parentPhone2.fill(
                data.parentPhone2
            );
        }

        await this.parentEmail2.fill(data.parentEmail2);

        await this.emergencyName.fill(data.emergencyName);

        await this.emergencyRelationship.fill(
            data.emergencyRelationship
        );

        if (data.emergencyPhone) {
            await this.emergencyPhone.fill(
                data.emergencyPhone
            );
        }

        await this.maleCheckbox.check({force: true});
        await this.permitNumber.fill(data.permitNumber);

        await this.medicalConditions.fill(
            data.medicalConditions
        );

        await this.studentNotes.fill(
            data.studentNotes
        );

        await this.drivingNotes.fill(
            data.drivingNotes
        );
        await this.termsConditionsCheckbox.check({force: true});
    }

    async selectDOBInStudentDetails() {

        await this.click(this.dobMonthDropdown);
        await this.click(this.dobMonth);

        await this.click(this.dobDayDropdown);
        await this.click(this.dobDay);

        await this.click(this.dobYearDropdown);
        await this.click(this.dobYear);
    }

    async save() {
        await this.saveButton.click();
        await this.click(this.yesConfirmationButton);
        await this.page.getByText('Your enrollment has been completed and a confirmation email has been sent.', {exact: true})

        await expect(
            this.page.getByText(
                'Your enrollment has been completed and a confirmation email has been sent.',
                {exact: true}
            )
        ).toBeVisible();
    }
}

module.exports = NewStudentEnrollmentPage;