import BasePage from '@utils/BasePage';
import {test} from '@playwright/test';

/**
 * Page Object representing the Website Content - FAQ page in C-Admin
 * (Communication > Website Content > Website FAQ).
 *
 * Provides a single reusable method to configure FAQ content for any tab.
 **/
export default class WebsiteFAQPage extends BasePage {

    /**
     * Initializes locators for Website FAQ page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.continueWithTemplateBtn = page.getByRole('button', {name: 'Continue with this template'});
        this.editIcon = page.locator('#createNewTab');
        this.addCategoryBtn = page.getByRole('button', {name: 'Add Category'});
        this.categoryNameInput = page.getByRole('textbox', {name: 'Enter Category Name'});
        this.saveCategoryBtn = page.locator('#btnSaveCategory');
        this.categoryAddedMessage = page.getByText('Category Added');
        this.addQuestionBtn = page.getByRole('button', {name: 'Add Question'})
        this.questionInput = page.getByRole('textbox', {name: 'Enter Question'});
        this.questionCategoryDropdown = page.locator('#addQuestionCategoryDropdown');
        this.answerInput = page.locator('div.note-editable:visible');
        this.saveQuestionBtn = page.locator('#btnFaqSaveQuestionAnswers');
        this.questionAddedMessage = page.getByText('Added Successfully');
        this.saveFaqLayoutBtn = page.locator('#btnsaveContentFaqSettings');
        this.layoutUpdatedMessage = page.getByText('Layouts setting Updated');
        this.categoryBlock = page.locator('#divCategoryBlock');
        this.categoryHeading = (categoryHeading) => page.locator(`//span[@class='faqCatHeading'][normalize-space()='${categoryHeading}']`);
        this.questionHeading = (question) => page.locator(`//span[@class='faqQuestHeading'][normalize-space()='${question}']`);
        this.answerContent = (answer) => page.locator(`//span[@class='faqQuestContent']//p[normalize-space()='${answer}']`);
        this.moreOptionsMenu = (categoryHeading) => page.locator(`(//span[normalize-space()='${categoryHeading}']//ancestor::li//a)[1]`);
        this.deleteIcon = page.locator('i.fa.fa-trash-alt:visible')
        this.deletedSuccessfulMessage = page.getByText('Deleted Successfully').first();


    }

    /**
     * Navigates to a FAQ tab when a tab name is provided.
     * @param {string} [tabName] - FAQ tab name.
     **/
    async navigateToTab(tabName) {
        if (!tabName) return;

        const tabLink = this.page.getByRole('link', {name: tabName, exact: true});
        if (await this.isVisible(tabLink, {timeout: 1500}).catch(() => false)) {
            await this.click(tabLink);
            await this.waitForLoaders();
        }
    }

    /**
     * Clicks "Continue with this template" when present.
     **/
    async continueWithTemplate() {
        await this.waitForVisible(this.continueWithTemplateBtn, {timeout: 5000}).catch(() => null);
        await this.click(this.continueWithTemplateBtn);
        await this.waitForLoaders();

    }

    /**
     * Opens FAQ edit mode.
     **/
    async openFaqEditor() {
        await this.waitForVisible(this.editIcon, 5000);
        await this.click(this.editIcon);
    }

    /**
     * Opens FAQ edit mode.
     * @param {any} text - category or question name
     **/
    async deleteData(text) {
        await this.waitForVisible(this.moreOptionsMenu(text), 5000);
        await this.click(this.moreOptionsMenu(text));
        await this.waitForVisible(this.deleteIcon);
        await this.click(this.deleteIcon);
        await this.waitForVisible(this.deletedSuccessfulMessage, 5000);
        await this.verifyVisible(this.deletedSuccessfulMessage)
    }

    /**
     * Adds a new FAQ category and verifies success.
     * @param {string} categoryName - Category name to add.
     **/
    async addCategory(categoryName) {
        await this.waitForVisible(this.addCategoryBtn, 5000);
        await this.click(this.addCategoryBtn);
        await this.waitForVisible(this.categoryNameInput, 5000);
        await this.fill(this.categoryNameInput, categoryName);
        await this.click(this.saveCategoryBtn);
        await this.waitForVisible(this.categoryAddedMessage, 10000);
        await this.verifyVisible(this.categoryAddedMessage);
    }

    /**
     * Adds a question and answer under the provided category and verifies success.
     * @param {{ categoryName: string, question: string, answer: string }} data - Question details.
     **/
    async addQuestionAndAnswer(data) {
        const {categoryName, question, answer} = data;

        await this.click(this.addQuestionBtn);
        await this.waitForVisible(this.questionInput, 5000);
        await this.fill(this.questionInput, question);
        await this.selectOption(this.questionCategoryDropdown, {label: categoryName});
        await this.fill(this.answerInput, answer);
        await this.click(this.saveQuestionBtn);
        await this.waitForVisible(this.questionAddedMessage, 10000);
        await this.verifyVisible(this.questionAddedMessage);
    }

    /**
     * Saves FAQ layout and verifies success.
     **/
    async saveFaqLayout() {
        await this.waitForVisible(this.saveFaqLayoutBtn, 5000);
        await this.click(this.saveFaqLayoutBtn);
        await this.waitForVisible(this.layoutUpdatedMessage, 10000);
        await this.verifyVisible(this.layoutUpdatedMessage);
    }

    /**
     * Verifies saved category, question, and answer content.
     * @param {{ categoryName: string, question: string, answer: string }} data - Expected FAQ data.
     * @param {boolean} isVisible
     **/
    async verifyFaqContent(data, isVisible) {
        const {categoryName, question, answer} = data;
        const categoryHeading = this.categoryHeading(categoryName);
        const questionHeading = this.questionHeading(question);
        const answerContent = this.answerContent(answer);

        if (isVisible) {
            await this.verifyVisible(categoryHeading);
            await this.verifyVisible(questionHeading);
            await this.click(questionHeading);
            await this.verifyVisible(answerContent);
        } else {
            await this.verifyNotVisible(categoryHeading);
            await this.verifyNotVisible(questionHeading);
            await this.verifyNotVisible(answerContent);
        }
    }

    /**
     * Configures one FAQ tab by composing reusable page actions.
     * @param {{ tabName?: string, categoryName: string, question: string, answer: string }} data - FAQ tab details.
     **/
    async configureFaqTab(data) {
        const {tabName, categoryName} = data;

        await test.step(`Configure ${tabName || 'FAQ'} tab`, async () => {
            await this.waitForLoaders();
            await this.navigateToTab(tabName);
            await this.continueWithTemplate();
            await this.openFaqEditor();
            await this.addCategory(categoryName);
            await this.addQuestionAndAnswer(data);
            await this.saveFaqLayout();
        });
    }

    /**
     * Verifies one FAQ tab by composing reusable page actions.
     * @param {{tabName?: string;categoryName: string;question: string;answer: string;}} data - FAQ tab details.
     * @param {boolean} isVisible
     */
    async verifyFaqTab(data, isVisible) {
        const {tabName} = data;

        await test.step(`Configure ${tabName || 'FAQ'} tab`, async () => {
            await this.waitForLoaders();
            await this.navigateToTab(tabName);
            await this.verifyFaqContent(data, isVisible);
        });
    }


    /**
     * Configures one FAQ tab by composing reusable page actions.
     * @param {{ tabName?: string, categoryName: string, question: string, answer: string }} data - FAQ tab details.
     **/
    async deleteFaqData(data) {
        const {tabName} = data;

        await test.step(`Delete ${tabName || 'FAQ'} tab`, async () => {
            await this.waitForLoaders();
            await this.navigateToTab(tabName);
            await this.continueWithTemplate();
            await this.openFaqEditor();
            await this.deleteData(data.categoryName);
            await this.deleteData(data.question);
            await this.verifyFaqContent(data, false);
        });
    }
}
