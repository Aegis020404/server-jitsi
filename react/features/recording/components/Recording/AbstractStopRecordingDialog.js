// @flow

import { Component } from 'react';

import {
    createRecordingDialogEvent,
    sendAnalytics
} from '../../../analytics';
import { JitsiRecordingConstants } from '../../../base/lib-jitsi-meet';
import { setVideoMuted } from '../../../base/media';
import { stopLocalVideoRecording } from '../../actions';
import { getActiveSession } from '../../functions';

import LocalRecordingManager from './LocalRecordingManager';

/**
 * The type of the React {@code Component} props of
 * {@link AbstractStopRecordingDialog}.
 */
export type Props = {

    /**
     * The {@code JitsiConference} for the current conference.
     */
    _conference: Object,

    /**
     * The redux representation of the recording session to be stopped.
     */
    _fileRecordingSession: Object,

    /**
     * Whether the recording is a local recording or not.
     */
    _localRecording: boolean,

    /**
     * The redux dispatch function.
     */
    dispatch: Function,

    /**
     * The user trying to stop the video while local recording is running.
     */
    localRecordingVideoStop?: boolean,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * Abstract React Component for getting confirmation to stop a file recording
 * session in progress.
 *
 * @augments Component
 */
export default class AbstractStopRecordingDialog<P: Props>
    extends Component<P> {
    /**
     * Initializes a new {@code AbstrStopRecordingDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: P) {
        super(props);

        // Bind event handler so it is only bound once for every instance.
        this._onSubmit = this._onSubmit.bind(this);
        this._toggleScreenshotCapture = this._toggleScreenshotCapture.bind(this);
    }

    _onSubmit: () => boolean;

    /**
     * Stops the recording session.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        sendAnalytics(createRecordingDialogEvent('stop', 'confirm.button'));

        if (this.props._localRecording) {
            this.props.dispatch(stopLocalVideoRecording());
            if (this.props.localRecordingVideoStop) {
                this.props.dispatch(setVideoMuted(true));
            }
        } else {
            const { _fileRecordingSession } = this.props;

            if (_fileRecordingSession) {
                this.props._conference.stopRecording(_fileRecordingSession.id);
                this._toggleScreenshotCapture();
            }
        }

        return true;
    }

    _toggleScreenshotCapture: () => void;

    /**
     * Toggles screenshot capture feature.
     *
     * @returns {void}
     */
    _toggleScreenshotCapture() {
        // To be implemented by subclass.
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code StopRecordingDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _conference: JitsiConference,
 *     _fileRecordingSession: Object
 * }}
 */
export function _mapStateToProps(state: Object) {
    return {
        _conference: state['features/base/conference'].conference,
        _fileRecordingSession:
            getActiveSession(state, JitsiRecordingConstants.mode.FILE),
        _localRecording: LocalRecordingManager.isRecordingLocally()
    };
}
