import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";
import { userManagementApi } from "../../../redux/features/Admin/userManagement.api";
import PhForm from "../../../components/form/PhForm";
import PhInput from "../../../components/form/PhInput";
import PhSelect from "../../../components/form/PhSelect";
import PhDatePicker from "../../../components/form/PhDatePicker";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { academicManagementApi } from "../../../redux/features/Admin/academicManagement.api";
import { toast } from "sonner";
import { bloodGroupOptions, genderOptions } from "../../../constants/global";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
const { Title } = Typography;

type InputConfig = {
  component: "input" | "select" | "datepicker" | "file";
  name: string;
  label: string;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
};

const StudentUpdate = () => {
  const { studentId } = useParams();
  const [updateStudent] = userManagementApi.useUpdateStudentMutation();
  const { data: studentData, isLoading: studentLoading } =
    userManagementApi.useGetStudentByIdQuery(studentId);
  const { data: semesterData, isLoading: sIsLoading } =
    academicManagementApi.useGetAllSemestersQuery(undefined);
  const { data: departmentData, isLoading: dIsLoading } =
    academicManagementApi.useGetAllDepartmentQuery(undefined, {
      skip: sIsLoading,
    });

  const semesterOptions = semesterData?.data?.map((item) => ({
    value: item._id,
    label: `${item.name} ${item.year}`,
  }));
  const departmentOptions = departmentData?.data?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      name: { firstName: "", middleName: "", lastName: "" },
      gender: "",
      dateOfBirth: null,
      bloodGroup: "",
      image: null,
      email: "",
      contactNo: "",
      emergencyContactNo: "",
      presentAddress: "",
      permanentAddress: "",
      guardian: {
        fatherName: "",
        fatherOccupation: "",
        fatherContactNo: "",
        motherName: "",
        motherOccupation: "",
        motherContactNo: "",
      },
      localGuardian: { name: "", occupation: "", contactNo: "", address: "" },
      admissionSemester: "",
      academicDepartment: "",
    },
  });

  useEffect(() => {
    if (studentData) {
      const fields = [
        ["name.firstName", studentData.data.name.firstName],
        ["name.middleName", studentData.data.name.middleName],
        ["name.lastName", studentData.data.name.lastName],
        ["gender", studentData.data.gender],
        ["dateOfBirth", studentData.data.dateOfBirth],
        ["bloodGroup", studentData.data.bloodGroup],
        ["image", studentData.data.image],
        ["email", studentData.data.email],
        ["contactNo", studentData.data.contactNo],
        ["emergencyContactNo", studentData.data.emergencyContactNo],
        ["presentAddress", studentData.data.presentAddress],
        ["permanentAddress", studentData.data.permanentAddress],
        ["guardian.fatherName", studentData.data.guardian.fatherName],
        [
          "guardian.fatherOccupation",
          studentData.data.guardian.fatherOccupation,
        ],
        ["guardian.fatherContactNo", studentData.data.guardian.fatherContactNo],
        ["guardian.motherName", studentData.data.guardian.motherName],
        [
          "guardian.motherOccupation",
          studentData.data.guardian.motherOccupation,
        ],
        ["guardian.motherContactNo", studentData.data.guardian.motherContactNo],
        ["localGuardian.name", studentData.data.localGuardian.name],
        ["localGuardian.occupation", studentData.data.localGuardian.occupation],
        ["localGuardian.contactNo", studentData.data.localGuardian.contactNo],
        ["localGuardian.address", studentData.data.localGuardian.address],
        ["admissionSemester", studentData.data.admissionSemester?._id || ""],
        ["academicDepartment", studentData.data.academicDepartment?._id || ""],
      ];
      fields.forEach(([field, value]) => setValue(field, value));
    }
  }, [studentData, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const studentData = {
      student: {
        ...data,
        admissionSemester:
          data.admissionSemester?.value || data.admissionSemester,
        academicDepartment:
          data.academicDepartment?.value || data.academicDepartment,
      },
    };
    try {
      await updateStudent({ studentId, data: studentData }).unwrap();
      toast.success("Student Update is Successful!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Error updating student", { position: "top-center" });
    }
  };

  if (studentLoading) return <div>Loading...</div>;

  const renderInputs = (inputs: InputConfig[]) =>
    inputs.map((input) => (
      <Col key={input.name} span={24} md={{ span: 12 }} lg={{ span: 8 }}>
        {input.component === "input" && (
          <PhInput
            control={control}
            type="text"
            name={input.name}
            label={input.label}
          />
        )}
        {input.component === "select" && (
          <PhSelect
            options={input.options}
            name={input.name}
            label={input.label}
            disabled={input.disabled}
          />
        )}
        {input.component === "datepicker" && (
          <PhDatePicker name={input.name} label={input.label} />
        )}
        {input.component === "file" && (
          <Controller
            name={input.name}
            render={({ field: { onChange, value, ...field } }) => (
              <Form.Item label={input.label}>
                <Input
                  type="file"
                  value={value?.fileName}
                  {...field}
                  onChange={(e) => onChange(e.target.files?.[0])}
                />
              </Form.Item>
            )}
          />
        )}
      </Col>
    ));

  const personalInfo: InputConfig[] = [
    { component: "input", name: "name.firstName", label: "First Name" },
    { component: "input", name: "name.middleName", label: "Middle Name" },
    { component: "input", name: "name.lastName", label: "Last Name" },
    {
      component: "select",
      name: "gender",
      label: "Gender",
      options: genderOptions,
    },
    { component: "datepicker", name: "dateOfBirth", label: "Date Of Birth" },
    {
      component: "select",
      name: "bloodGroup",
      label: "Blood Group",
      options: bloodGroupOptions,
    },
    { component: "file", name: "image", label: "Profile Picture" },
  ];

  const contactInfo: InputConfig[] = [
    { component: "input", name: "email", label: "Email" },
    { component: "input", name: "contactNo", label: "Contact No" },
    {
      component: "input",
      name: "emergencyContactNo",
      label: "Emergency Contact No",
    },
    { component: "input", name: "presentAddress", label: "Present Address" },
    {
      component: "input",
      name: "permanentAddress",
      label: "Permanent Address",
    },
  ];

  const guardianInfo: InputConfig[] = [
    { component: "input", name: "guardian.fatherName", label: "Father Name" },
    {
      component: "input",
      name: "guardian.fatherOccupation",
      label: "Father Occupation",
    },
    {
      component: "input",
      name: "guardian.fatherContactNo",
      label: "Father Contact No",
    },
    { component: "input", name: "guardian.motherName", label: "Mother Name" },
    {
      component: "input",
      name: "guardian.motherOccupation",
      label: "Mother Occupation",
    },
    {
      component: "input",
      name: "guardian.motherContactNo",
      label: "Mother Contact No",
    },
  ];

  const localGuardianInfo: InputConfig[] = [
    { component: "input", name: "localGuardian.name", label: "Name" },
    {
      component: "input",
      name: "localGuardian.occupation",
      label: "Occupation",
    },
    {
      component: "input",
      name: "localGuardian.contactNo",
      label: "Contact No",
    },
    { component: "input", name: "localGuardian.address", label: "Address" },
  ];

  const academicInfo: InputConfig[] = [
    {
      component: "select",
      name: "admissionSemester",
      label: "Admission Semester",
      options: semesterOptions,
      disabled: sIsLoading,
    },
    {
      component: "select",
      name: "academicDepartment",
      label: "Academic Department",
      options: departmentOptions,
      disabled: dIsLoading,
    },
  ];

  return (
    <Row>
      <Col span={24}>
        <Title level={2} style={{ textAlign: "center", marginTop: "30px" }}>
          Update Student Data
        </Title>
      </Col>
      <Col span={24}>
        <PhForm onSubmit={handleSubmit(onSubmit)}>
          <Divider>Personal Information</Divider>
          <Row gutter={8}>{renderInputs(personalInfo)}</Row>
          <Divider>Contact Information</Divider>
          <Row gutter={8}>{renderInputs(contactInfo)}</Row>
          <Divider>Guardian Information</Divider>
          <Row gutter={8}>{renderInputs(guardianInfo)}</Row>
          <Divider>Local Guardian Information</Divider>
          <Row gutter={8}>{renderInputs(localGuardianInfo)}</Row>
          <Divider>Academic Information</Divider>
          <Row gutter={8}>{renderInputs(academicInfo)}</Row>
          <Button htmlType="submit">Submit</Button>
        </PhForm>
      </Col>
    </Row>
  );
};

export default StudentUpdate;
