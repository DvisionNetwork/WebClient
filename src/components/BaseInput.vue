<template>
	<div class="field-set">
		<label v-if="field.label" :for="uuid" class="label">
			{{ field.label }}
		</label>
		<div class="field-box-wrap">
			<div class="field-box">
				<input class="field"
					v-bind="{
						...$attrs,
						onInput: updateValue,
					}"
					@input_xx2="updateValue"
					@input_xx="$emit('update:modelValue', $event.target.value)"
					:type="field.type"
					:id="uuid"
					:name="field.name"
					:value="modelValue"
					:placeholder="field.placeholder ? field.placeholder : field.label"
					:aria-describedby="error ? `${uuid}-error` : null"
					:aria-invalid="error ? true : false"
					:class_zzzz="{ error }"
				/>
				<div v-if="field.buttonName" class="field-button">
					{{field.buttonName}}
				</div>
				<BaseErrorMessage v-if="error" :id="`${uuid}-error`">
					{{ error }}
				</BaseErrorMessage>
			</div>
			<div class="h-bar"></div>
		</div>

	</div>

</template>

<script>
import SetupFormComponent from '@/features/SetupFormComponent'

export default {
	props: {
		field: {
			type: Object,
			default: {},
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
		error: {
			type: String,
			default: '',
		},
	},
	setup(props, context) {
		const { updateValue } = SetupFormComponent(props, context)
		const uuid = _U.getUUID()

		return {
			updateValue,
			uuid,
		}
	},
}
</script>

<style scoped>

</style>
