import React, { useRef, useState, useMemo } from "react";
const useFormChange = () => {
	const formData = useRef({})
	const [, forceUpdate] = useState(null)
	const handerForm = useMemo(() => {
		const setFormData = (keys, value) => {
			const form = formData.current
			form?.[keys] = value
			forceUpdate(value)
		}
		return [setFormData]
	}, [])
	return [formData.current, ...handerForm]
}

export default useFormChange