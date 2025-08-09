<template>
    <DatePicker
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #prevbutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="actionCallback" @keydown="keydownCallback">
                <template #icon>
                    <ChevronLeftIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #nextbutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="actionCallback" @keydown="keydownCallback">
                <template #icon>
                    <ChevronRightIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #todaybutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" label="Today" size="small" @click="actionCallback" @keydown="keydownCallback" />
        </template>
        <template #clearbutton="{ actionCallback, keydownCallback }">
            <SecondaryButton variant="text" label="Clear" size="small" @click="actionCallback" @keydown="keydownCallback" />
        </template>
        <template #dropdownicon>
            <ChevronDownIcon />
        </template>
        <template #inputicon>
            <CalendarIcon />
        </template>
        <template #hourincrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon>
                    <ChevronUpIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #hourdecrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon>
                    <ChevronDownIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #minuteincrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon>
                    <ChevronUpIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #minutedecrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon>
                    <ChevronDownIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #secondincrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon>
                    <ChevronUpIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #seconddecrementbutton="{ callbacks }">
            <SecondaryButton variant="text" rounded v-on="callbacks">
                <template #icon>
                    <ChevronDownIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #ampmincrementbutton="{ toggleCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="toggleCallback" @keydown="keydownCallback">
                <template #icon>
                    <ChevronUpIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #ampmdecrementbutton="{ toggleCallback, keydownCallback }">
            <SecondaryButton variant="text" rounded @click="toggleCallback" @keydown="keydownCallback">
                <template #icon>
                    <ChevronDownIcon />
                </template>
            </SecondaryButton>
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </DatePicker>
</template>

<script setup>
import CalendarIcon from "@primevue/icons/calendar";
import ChevronDownIcon from "@primevue/icons/chevrondown";
import ChevronLeftIcon from "@primevue/icons/chevronleft";
import ChevronRightIcon from "@primevue/icons/chevronright";
import ChevronUpIcon from "@primevue/icons/chevronup";
import DatePicker from "primevue/datepicker";
import { ref } from "vue";

import SecondaryButton from "./SecondaryButton.vue";
import { ptViewMerge } from "./utils";

const theme = ref({
	root: "inline-flex max-w-full relative p-fluid:flex",
	pcInputText: {
		root: `flex-auto w-[1%] appearance-none rounded-md outline-hidden
        p-has-dropdown:rounded-e-none p-has-e-icon:pe-10
        bg-white
        text-gray-900
        placeholder:text-gray-500
        border border-gray-300
        enabled:hover:border-gray-400
        enabled:focus:border-blue-500
        disabled:bg-gray-200 disabled:text-gray-500
        p-invalid:border-red-400
        p-invalid:placeholder:text-red-600
        px-3 py-2 p-fluid:w-full
        p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
        p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
        transition-colors duration-200 shadow-sm`,
	},
	dropdown: `cursor-pointer inline-flex items-center justify-center select-none overflow-hidden relative w-10 shrink-0 rounded-e-md
        border border-s-0 border-gray-300
        bg-gray-100 enabled:hover:bg-gray-200 enabled:active:bg-gray-300
        text-gray-600 enabled:hover:text-gray-700 enabled:hover:active:text-gray-800
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        transition-colors duration-200`,
	inputIconContainer:
		"cursor-pointer absolute top-1/2 end-3 -mt-2 text-gray-400 leading-none p-small:*:size-[0.875rem] p-large:*:size-[1.125rem]",
	panel: `p-portal-self:min-w-full w-auto p-3 rounded-md
        p-inline:inline-block p-inline:overflow-x-auto p-inline:shadow-none
        border border-gray-200
        bg-white
        text-gray-900
        shadow-lg`,
	calendarContainer: "flex bg-white",
	calendar: `flex-auto border-s border-gray-200 gap-3 px-3
        first:ps-0 first:border-s-0 last:pe-0 bg-white`,
	header: `flex items-center justify-between pt-0 px-0 pb-2 font-medium gap-2
        bg-white
        text-gray-900
        border-b border-gray-200`,
	title: "flex items-center justify-between gap-2 font-medium",
	selectMonth: `border-none bg-transparent m-0 cursor-pointer font-medium transition-colors duration-200
        py-1 px-2 rounded-md text-gray-900
        enabled:hover:bg-gray-100 enabled:hover:text-gray-900
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-blue-500`,
	selectYear: `border-none bg-transparent m-0 cursor-pointer font-medium transition-colors duration-200
        py-1 px-2 rounded-md text-gray-900
        enabled:hover:bg-gray-100 enabled:hover:text-gray-900
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-blue-500`,
	decade: "white-space-nowrap",
	dayView: "w-full border-collapse text-base mt-2 mx-0 mb-0",
	tableHeader: "",
	tableHeaderRow: "",
	weekHeader: "p-1",
	weekHeaderLabel: "font-medium text-gray-600 opacity-60",
	tableHeaderCell: "",
	weekDayCell: "p-1",
	weekDay: "font-medium text-gray-600",
	tableBody: "",
	weekNumber: "",
	weekLabelContainer: "opacity-60 flex w-8 h-8 p-1 justify-center",
	weekLabel: "",
	dayCell: "p-1",
	day: `flex items-center justify-center cursor-pointer my-0 mx-auto overflow-hidden relative w-8 h-8
        rounded-full p-1 transition-colors duration-200 border border-transparent text-gray-900
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        p-disabled:opacity-60 p-disabled:pointer-events-none
        hover:bg-gray-100 hover:text-gray-900
        p-selected:bg-blue-500 p-selected:text-white
        p-today:bg-gray-200 p-today:text-gray-900
        p-today:hover:bg-gray-100 p-today:hover:text-gray-900
        p-today:p-selected:bg-blue-500 p-today:p-selected:text-white`,
	monthView: "mt-2 mb-0 mx-0",
	month: `w-1/3 inline-flex items-center justify-center cursor-pointer overflow-hidden relative
        p-[0.375rem] transition-colors duration-200 rounded-md text-gray-900
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        hover:bg-gray-100 hover:text-gray-900
        p-selected:bg-blue-500 p-selected:text-white`,
	yearView: "mt-2 mb-0 mx-0",
	year: `w-1/2 inline-flex items-center justify-center cursor-pointer overflow-hidden relative
        p-[0.375rem] transition-colors duration-200 rounded-md text-gray-900
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        hover:bg-gray-100 hover:text-gray-900
        p-selected:bg-blue-500 p-selected:text-white`,
	timePicker: `flex items-center justify-center border-t border-gray-200 p-0 gap-2
        not-p-time-only:pt-2 not-p-time-only:pb-0 not-p-time-only:px-0`,
	hourPicker: "flex items-center flex-col gap-1",
	hour: "text-base",
	separatorContainer: "flex items-center flex-col gap-1",
	separator: "text-base",
	minutePicker: "flex items-center flex-col gap-1",
	minute: "text-base",
	secondPicker: "flex items-center flex-col gap-1",
	second: "text-base",
	ampmPicker: "flex items-center flex-col gap-1",
	ampm: "text-base",
	buttonbar:
		"flex justify-between items-center pt-2 pb-0 px-0 border-t border-gray-200",
	transition: {
		enterFromClass: "opacity-0 scale-y-75",
		enterActiveClass: "transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]",
		leaveActiveClass: "transition-opacity duration-100 ease-linear",
		leaveToClass: "opacity-0",
	},
});
</script>
