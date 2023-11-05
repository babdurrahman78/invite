export default function Page() {
    return <div className="flex flex-col items-center pt-[195px]">
        <p className="font-bold text-[36px] text-primaryDarker mb-[42px]">
            Thank you for joining the interview session!
        </p>

        <div style={{
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            backgroundColor: "rgba(217, 217, 217, 0.35)"
        }} className="w-[685px] h-[176px] rounded-[20px] p-[25px]">
            <p className="text-[22px] text-center">
                We truly appreciate your participation, and we're delighted to have had the chance to get to know you. We hope this opportunity opens doors to a successful career within our company. See you in the future!
            </p>
        </div>
    </div>
}