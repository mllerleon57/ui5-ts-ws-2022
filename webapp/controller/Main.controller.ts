import MessageBox from "sap/m/MessageBox";
import { Action } from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Event from "sap/ui/base/Event";
import GridListItem from "sap/f/GridListItem";
import MessageToast from "sap/m/MessageToast";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";

/**
 * @namespace de.inwerken.pizzaApp.controller
 */
export default class Main extends BaseController {
  private formatter = formatter;

  public orderItem(oEvent: Event): void {
    const sPizzaId = (oEvent.getSource() as GridListItem)
      .getBindingContext()
      .getProperty("Id") as string;

    const oResourceBundle = this.getResourceBundle() as ResourceBundle;
    MessageBox.confirm(oResourceBundle.getText("msg.confirmOrder"), {
      onClose: (oAction: Action) => {
        if (oAction === Action.OK) {
          this._createOrder(sPizzaId);
        }
      },
    });
  }

  private _createOrder(sPizzaId: string) {
    const oData = { Id: sPizzaId };
    const oResourceBundle = this.getResourceBundle() as ResourceBundle;

    (this.getModel() as ODataModel).create("/OrderSet", oData, {
      success: () =>
        MessageToast.show(oResourceBundle.getText("msg.orderSuccess")),
    });
  }
}
