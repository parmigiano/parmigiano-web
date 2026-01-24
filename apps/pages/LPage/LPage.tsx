import GUIButton from "@/components/ui/Button/GUIButton"
import { GUInput } from "@/components/ui/Input/GUInput"
import { useTranslation } from "react-i18next"

const LPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center mt-[6rem]">
            <div className="w-[25rem] text-center space-y-8">
                <img src="/logo-bg-none.png" width={200} className="mx-auto" />


                <div className="space-y-2">
                    <p className="font-bold text-[2rem]">{t("message.signin-parmigiano")}</p>
                    <p className="text-[#999] text-balance">{t("message.signin-email-desc")}</p>
                </div>


                <GUInput placeholder="Email" />
                <GUIButton className="!font-medium">{t("label.next")}</GUIButton>
            </div>
        </div>
    )
}

export default LPage
