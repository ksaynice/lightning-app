/**
 * @fileOverview computed values that are used in wallet UI components.
 */

import { extendObservable } from 'mobx';
import { toAmountLabel } from '../helper';
import {
  UNITS,
  FIATS,
  MIN_PASSWORD_LENGTH,
  STRONG_PASSWORD_LENGTH,
} from '../config';

const ComputedWallet = store => {
  extendObservable(store, {
    get walletAddressUri() {
      return store.walletAddress ? `bitcoin:${store.walletAddress}` : '';
    },
    get totalBalanceSatoshis() {
      const {
        balanceSatoshis,
        pendingBalanceSatoshis,
        channelBalanceSatoshis,
      } = store;
      return balanceSatoshis + pendingBalanceSatoshis + channelBalanceSatoshis;
    },
    get totalBalanceLabel() {
      return toAmountLabel(store.totalBalanceSatoshis, store.settings);
    },
    get unitFiatLabel() {
      const { displayFiat, unit, fiat } = store.settings;
      return displayFiat ? FIATS[fiat].display : UNITS[unit].display;
    },
    get unitLabel() {
      const { settings } = store;
      return !settings.displayFiat ? UNITS[settings.unit].display : null;
    },
    get channelPercentageLabel() {
      const {
        channelBalanceSatoshis: opened,
        pendingBalanceSatoshis: pending,
        totalBalanceSatoshis: total,
      } = store;
      const percent = total ? (opened + pending) / total * 100 : 0;
      return `${Math.round(percent)}% on Lightning`;
    },
    get newPasswordCopy() {
      const { newPassword } = store.wallet;
      return getNewPasswordCopy({ newPassword });
    },
    get newPasswordSuccess() {
      const { newPassword } = store.wallet;
      if (!newPassword) {
        return null;
      }
      return newPassword.length >= MIN_PASSWORD_LENGTH;
    },
  });
};

/**
 * If necessary, return copy advising the user on the quality of their password.
 * @param  {string} options.walletPassword The password used to encrypt the wallet
 * @return {string}
 */
const getNewPasswordCopy = ({ newPassword }) => {
  if (newPassword.length >= STRONG_PASSWORD_LENGTH) {
    return "Now that's a strong password!";
  } else if (newPassword.length >= MIN_PASSWORD_LENGTH) {
    return 'Pro tip: add a few more characters to strengthen your password.';
  }
  return '';
};

export default ComputedWallet;
