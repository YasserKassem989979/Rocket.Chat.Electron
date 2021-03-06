import { Box, Button, Margins, Scrollable, Tile } from '@rocket.chat/fuselage';
import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { takeEvery } from 'redux-saga/effects';
import { useTranslation } from 'react-i18next';

import { Dialog } from '../Dialog';
import { useSaga } from '../SagaMiddlewareProvider';
import {
	CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED,
	SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED,
} from '../../actions';

export function SelectClientCertificateDialog() {
	const isVisible = useSelector(({ openDialog }) => openDialog === 'select-client-certificate');
	const requestIdRef = useRef();
	const [certificateList, setCertificateList] = useState([]);
	const dispatch = useDispatch();

	useSaga(function *() {
		yield takeEvery(CERTIFICATES_CLIENT_CERTIFICATE_REQUESTED, function *({ payload: { requestId, certificateList } }) {
			requestIdRef.current = requestId;
			setCertificateList(certificateList);
		});
	});

	const handleClose = () => {
		requestIdRef.current = null;
		dispatch({ type: 'noop' });
	};

	const handleSelect = (certificate) => () => {
		dispatch({
			type: SELECT_CLIENT_CERTIFICATE_DIALOG_CERTIFICATE_SELECTED,
			payload: {
				requestId: requestIdRef.current,
				fingerprint: certificate.fingerprint,
			},
		});
	};

	const { t } = useTranslation();

	return <Dialog isVisible={isVisible} onClose={handleClose}>
		<Box fontScale='h1'>{t('dialog.selectClientCertificate.announcement')}</Box>
		<Margins inline='neg-x12'>
			<Scrollable>
				<Box>
					<Margins all='x12'>
						{certificateList.map((certificate, i) => <Tile key={i}>
							<Margins inline='neg-x8'>
								<Box display='flex' alignItems='end' justifyContent='space-between'>
									<Margins inline='x8'>
										<Box>
											<Box fontScale='s1'>
												{certificate.subjectName}
											</Box>
											<Box fontScale='p2'>
												{certificate.issuerName}
											</Box>
											<Box fontScale='c1'>
												{t('dialog.selectClientCertificate.validDates', {
													validStart: new Date(certificate.validStart * 1000),
													validExpiry: new Date(certificate.validExpiry * 1000),
												})}
											</Box>
										</Box>
										<Button primary flexShrink={1} onClick={handleSelect(certificate)}>
											{t('dialog.selectClientCertificate.select')}
										</Button>
									</Margins>
								</Box>
							</Margins>
						</Tile>)}
					</Margins>
				</Box>
			</Scrollable>
		</Margins>
	</Dialog>;
}
