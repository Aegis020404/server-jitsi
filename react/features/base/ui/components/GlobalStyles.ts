import { createStyles, makeStyles } from '@material-ui/core';

import { commonStyles, getGlobalStyles } from '../constants';
// eslint-disable-next-line lines-around-comment
// @ts-ignore
import { formatCommonClasses } from '../functions';

/**
 * Creates all the global styles.
 *
 * @param {Object} theme - The current UI theme.
 *
 * @returns {Object}
 */
const useStyles = makeStyles((theme: any) =>
    createStyles({
        '@global': {
            ...formatCommonClasses(commonStyles(theme)),
            ...getGlobalStyles(theme)
        }
    })
);

/**
 * A component generating all the global styles.
 *
 * @returns {void}
 */
function GlobalStyles() {
    useStyles();

    return null;
}

export default GlobalStyles;
