import MessageBox from "sap/m/MessageBox";
import { Action } from "sap/m/MessageBox";
import BaseController from "./BaseController";
import formatter from "../model/formatter";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Event from "sap/ui/base/Event";
import GridListItem from "sap/f/GridListItem";
import MessageToast from "sap/m/MessageToast";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";

/**
 * @namespace de.inwerken.pizzaApp.controller
 */
export default class Main extends BaseController {
  private formatter = formatter;
  private _oOrdersDialog: Dialog;

  public async showOrders() {
    if (typeof this._oOrdersDialog === "undefined") {
      this._oOrdersDialog = (await Fragment.load({
        name: "de.inwerken.pizzaApp.view.fragment.Order",
        controller: this,
      })) as Dialog;
      this.getView().addDependent(this._oOrdersDialog);
    }

    this._oOrdersDialog.open();
  }

  public deleteOrder(oEvent: Event) {
    const sBindingPath = (oEvent.getParameter("listItem") as GridListItem)
      .getBindingContext()
      .getPath();

    (this.getModel() as ODataModel).remove(sBindingPath);
  }

  public closeOrdersDialog() {
    this._oOrdersDialog.close();
  }

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

  private _createOrder(sPizzaId: string): void {
    const oData = { Menuid: sPizzaId };
    const oResourceBundle = this.getResourceBundle() as ResourceBundle;

    (this.getModel() as ODataModel).create("/OrderSet", oData, {
      success: () =>
        MessageToast.show(oResourceBundle.getText("msg.orderSuccess")),
    });
  }
}
