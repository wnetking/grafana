import { DeleteDashboardConfig } from './deleteDashboard';
import { e2e } from '../index';
import { getDashboardUid } from '../support/url';
import { selectOption } from './selectOption';

export interface AddDashboardConfig {
  timezone: string;
  title: string;
}

// @todo this actually returns type `Cypress.Chainable`
export const addDashboard = (config?: Partial<AddDashboardConfig>): any => {
  const fullConfig = {
    timezone: 'UTC',
    title: `e2e-${Date.now()}`,
    ...config,
  } as AddDashboardConfig;

  const { timezone, title } = fullConfig;

  e2e().logToConsole('Adding dashboard with title:', title);

  e2e.pages.AddDashboard.visit();

  e2e.pages.Dashboard.Toolbar.toolbarItems('Dashboard settings').click();

  selectOption(e2e.pages.Dashboard.Settings.General.timezone(), timezone);

  e2e.pages.Dashboard.Settings.General.saveDashBoard();

  e2e.pages.SaveDashboardAsModal.newName()
    .clear()
    .type(title);
  e2e.pages.SaveDashboardAsModal.save().click();

  e2e.flows.assertSuccessNotification();

  e2e().logToConsole('Added dashboard with title:', title);

  return e2e()
    .url()
    .then((url: string) => {
      const uid = getDashboardUid(url);

      e2e.getScenarioContext().then(({ addedDashboards }: any) => {
        e2e.setScenarioContext({
          addedDashboards: [...addedDashboards, { title, uid } as DeleteDashboardConfig],
        });
      });

      // @todo remove `wrap` when possible
      return e2e().wrap({
        config: fullConfig,
        uid,
      });
    });
};
