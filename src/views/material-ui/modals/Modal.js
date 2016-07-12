import React, { PropTypes } from "react";
import { Dialog, FlatButton } from "material-ui";
import ErrorList from "../ErrorList";
import { connect } from "react-redux";

class BaseModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    errorAddr: PropTypes.array,
    closeBtnLabel: PropTypes.string,
    actions: PropTypes.array,
    closeAction: PropTypes.func
  };

  static defaultProps = {
    show: false,
    errorAddr: null,
    closeBtnLabel: "Ok",
    actions: []
  };

  close () {
    this.props.dispatch(this.props.closeAction());
  }

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  getErrorList () {
    let [base, ...rest] = this.props.errorAddr;
    return <ErrorList errors={this.props.auth.getIn([
      base, this.getEndpoint(), ...rest
    ])} />
  }

  render () {
    let body = (this.props.errorAddr)
      ? this.getErrorList()
      : this.props.children;

    return (
      <Dialog
        open={this.props.show}
        contentClassName={`redux-auth-modal ${this.props.containerClass}`}
        title={this.props.title}
        actions={[
          <FlatButton
            key="close"
            className={`${this.props.containerClass}-close`}
            onClick={this.close.bind(this)}>
            {this.props.closeBtnLabel}
          </FlatButton>,
          ...this.props.actions
        ]}>
        {body}
      </Dialog>
    );
  }
}

export default connect((state) => { console.log(state); return {auth: state.get("auth")}; })(BaseModal);
