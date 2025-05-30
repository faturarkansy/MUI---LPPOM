import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
// import Select from "../Select";
// import { EyeCloseIcon, EyeIcon, TimeIcon } from "../../../icons";
// import DatePicker from "../date-picker.tsx";
// import Button from "../../ui/button/Button.tsx";

export default function DefaultInputs() {
  // const [showPassword, setShowPassword] = useState(false);
  // const options = [
  //   { value: "marketing", label: "Marketing" },
  //   { value: "template", label: "Template" },
  //   { value: "development", label: "Development" },
  // ];
  // const handleSelectChange = (value: string) => {
  //   console.log("Selected value:", value);
  // };

  return (
    <ComponentCard title="Input Estimation Field">
      <div className="space-y-6">
        <div>
          <Label htmlFor="inputTwo">FIELD A</Label>
          <Input type="text" id="inputTwo" placeholder="Enter Value" />
        </div>

        <div>
          <Label htmlFor="inputTwo">FIELD B</Label>
          <Input type="text" id="inputTwo" placeholder="Enter Value" />
        </div>

        <div>
          <Label htmlFor="inputTwo">FIELD C</Label>
          <Input type="text" id="inputTwo" placeholder="Enter Value" />
        </div>

        <div>
          <Label htmlFor="inputTwo">FIELD D</Label>
          <Input type="text" id="inputTwo" placeholder="Enter Value" />
        </div>

        <div>
          <Label htmlFor="inputTwo">FIELD E</Label>
          <Input type="text" id="inputTwo" placeholder="Enter Value" />
        </div>

        <div>
          <button
            className="px-8 py-3 text-xs bg-blue-500 text-white rounded"
            disabled
          >
            Calculate
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}
