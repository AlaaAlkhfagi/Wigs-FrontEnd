import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ButtonSpinner from '@/components/ButtonSpinner';
import { DOMAIN } from '@/utils/constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddDoctorForm = () => {
    const { handleSubmit, control, formState: { errors } } = useForm();
    const [loading, setLoading] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token not found in localStorage");
            }

            const response = await axios.post(`${DOMAIN}/doctors/createDoctor`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Doctor created:', response.data);
            toast.success('Doctor added successfully');

            setSubmitted(true);

        } catch (error: any) {
            toast.error('Failed to add doctor. Please try again.');
            console.error('Error adding doctor:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="w-full max-w-full bg-gray-100 p-6 mx-auto my-8 rounded-lg text-center">
                <CardHeader>
                    <CardTitle className="text-xl">Doctor Added Successfully</CardTitle>
                </CardHeader>
                <CardContent className="text-lg">
                    <p>Doctor has been successfully added!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-screen-xl bg-gray-100 p-6 mx-auto my-8 rounded-lg">
            <CardHeader>
                <CardTitle className="text-xl">Add New Doctor</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Doctor Name */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Doctor Name</label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Please input the doctor name!' }}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Doctor Name"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                        {errors.name && <span className="text-red-500">{String(errors.name.message)}</span>}
                    </div>

                    {/* Birthday */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Birthday</label>
                        <Controller
                            name="birthday"
                            control={control}
                            rules={{ required: 'Please select the birthday!' }}
                            render={({ field }) => (
                                <input
                                    type="date"
                                    placeholder="Birthday"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                        {errors.birthday && <span className="text-red-500">{String(errors.birthday.message)}</span>}
                    </div>

                    {/* Region */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Region</label>
                        <Controller
                            name="area"
                            control={control}
                            rules={{ required: 'Please select a region!' }}
                            render={({ field }) => (
                                <select
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const options = (e.target as HTMLSelectElement).options;
                                            const selectedIndex = (e.target as HTMLSelectElement).selectedIndex;
                                            const nextIndex = (selectedIndex + 1) % options.length;
                                            (e.target as HTMLSelectElement).selectedIndex = nextIndex;
                                        }
                                    }}
                                >
                                    <option value="">Unknown</option>
                                    <option value="Baghdad-Karkh">Baghdad-Karkh</option>
                                    <option value="Baghdad-Rusafa">Baghdad-Rusafa</option>
                                    <option value="Karbala">Karbala</option>
                                    <option value="Wasit">Wasit</option>
                                    <option value="Babel">Babel</option>
                                    <option value="Basra">Basra</option>
                                    <option value="Erbil">Erbil</option>
                                    <option value="Dohuk">Dohuk</option>
                                    <option value="Sulaimania">Sulaimania</option>
                                    <option value="Dhi-Qar">Dhi-Qar</option>
                                    <option value="Najaf">Najaf</option>
                                    <option value="Semawa">Semawa</option>
                                    <option value="Mosel">Mosel</option>
                                    <option value="Salah-Aldeen">Salah-Aldeen</option>
                                    <option value="Missan">Missan</option>
                                    <option value="Diala">Diala</option>
                                    <option value="Kirkuk">Kirkuk</option>
                                    <option value="Qadisia">Qadisia</option>
                                </select>
                            )}
                        />
                        {errors.area && <span className="text-red-500">{String(errors.area.message)}</span>}
                    </div>

                    {/* Specialty */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Specialty</label>
                        <Controller
                            name="specialty"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Specialty"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Phone Number</label>
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Child 1 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Child 1</label>
                        <Controller
                            name="child1"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Child 1"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Child 2 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Child 2</label>
                        <Controller
                            name="child2"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Child 2"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Child 3 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Child 3</label>
                        <Controller
                            name="child3"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Child 3"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Close Friend 1 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Close Friend 1</label>
                        <Controller
                            name="closeFriend1"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Close Friend 1"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Close Friend 2 */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Close Friend 2</label>
                        <Controller
                            name="closeFriend2"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Close Friend 2"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* University (1) */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">University (1)</label>
                        <Controller
                            name="university1"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="University (1)"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* University (2) */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">University (2)</label>
                        <Controller
                            name="university2"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="University (2)"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    {/* Spouse */}
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold mb-1">Spouse</label>
                        <Controller
                            name="wife"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="text"
                                    placeholder="Spouse"
                                    className="w-full py-1 px-2 text-lg rounded-md border-gray-300"
                                    {...field}
                                />
                            )}
                        />
                    </div>

                    <CardFooter className="col-span-2 mt-4">
                        <Button
                            type="submit"
                            className="w-full py-2 px-6 text-lg rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? <ButtonSpinner /> : "Add Doctor"}
                        </Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddDoctorForm;
