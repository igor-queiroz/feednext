import { Checkbox, message, Form, Input, Tabs, Button } from 'antd'
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale'
import React, { useEffect } from 'react'

import Link from 'umi/link'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.less'
import { signIn } from '@/services/api'
import { router } from 'umi'
import { SIGN_IN } from '@/redux/Actions/User/types'
import { SET_ACCESS_TOKEN } from '@/redux/Actions/Global/types'

export declare interface FormDataType {
	usernameOrEmail: string
	password: string
	remember: boolean
}

const Login: React.FunctionComponent = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()

	const onSubmit = (values: FormDataType): void => {
		const isEmail = /\S+@\S+\.\S+/.test(values.usernameOrEmail)

		signIn({
			...(isEmail ? { email: values.usernameOrEmail } : { username: values.usernameOrEmail }),
			rememberMe: values.remember ? true : false,
			password: values.password,
		})
			.then(res => {
				dispatch({
					type: SET_ACCESS_TOKEN,
					token: res.data.attributes.access_token
				})
				delete res.data.attributes.access_token

				dispatch({
					type: SIGN_IN,
					user: res.data,
				})
				router.push('/feeds')
			})
			.catch(error => {
				message.error(error.response.data.message, 5)
			})
	}

	return (
		<div className={styles.main}>
			<Form form={form} name="sign-in" onFinish={onSubmit} size="middle" scrollToFirstError>
				<Tabs>
					<Tabs.TabPane
						key="sign-in"
						tab={formatMessage({
							id: 'userandlogin.login.tab-login-signin',
						})}
					>
						<Form.Item
							name="usernameOrEmail"
							rules={[{ required: true, message: 'Please input your username or email!' }]}
						>
							<Input placeholder="Username or Email" />
						</Form.Item>

						<Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
							<Input.Password placeholder="Password" />
						</Form.Item>

						<Form.Item name="remember" valuePropName="checked">
							<Checkbox>Remember me</Checkbox>
						</Form.Item>

						<Form.Item>
							<Button className={styles.submit} size="large" type="primary" htmlType="submit">
								Submit
							</Button>
							<Link className={styles.register} to="/auth/sign-up">
								<FormattedMessage id="userandlogin.login.signup" />
							</Link>
						</Form.Item>
					</Tabs.TabPane>
				</Tabs>
			</Form>
		</div>
	)
}

export default Login
