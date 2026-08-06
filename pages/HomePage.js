const BasePage = require("../utils/BasePage");

class HomePage extends BasePage {

    constructor(page) {
        super(page);

        // Main Menu
        this.reportCenter = page.locator("#ReportCenterSideMenu");
        this.schedulingMenu = page.locator("#li_scheduingmenu");

        // Scheduling
        this.singleInstructorLink = page
            .locator("#scheduling_SingleInstructor_li")
            .getByRole("link", {
                name: "Single Instructor"
            });
    }

    // Dynamic Locator
    getReportSection(sectionName) {
        return this.page.locator(
            `.ReportCenter_${sectionName.replaceAll(" ", "")}`
        );
    }

    async navigateToReportSection(sectionName) {
        await this.click(this.reportCenter);

        const reportSection = this.getReportSection(sectionName);

        await this.verifyVisible(reportSection);
        await this.click(reportSection);
    }

    async navigateToSingleInstructor() {
        await this.click(this.schedulingMenu);
        await this.click(this.singleInstructorLink);
    }
}

module.exports = HomePage;