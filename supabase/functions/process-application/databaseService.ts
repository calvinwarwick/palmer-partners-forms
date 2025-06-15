
export const saveApplicationToDatabase = async (supabase: any, application: any) => {
  const { data: insertedData, error: dbError } = await supabase
    .from('tenancy_applications')
    .insert([{
      applicants: application.applicants,
      property_preferences: application.propertyPreferences,
      additional_details: application.additionalDetails,
      data_sharing: application.dataSharing,
      signature: application.signature,
      status: 'pending'
    }])
    .select()
    .single();

  if (dbError) {
    console.error('Database save error:', dbError);
    throw new Error('Failed to save application');
  }

  console.log('Application saved to database:', insertedData.id);
  return insertedData;
};

export const logActivity = async (supabase: any, data: {
  application_id?: string;
  action: string;
  user_identifier?: string;
  details?: any;
}) => {
  await supabase
    .from('activity_logs')
    .insert([{
      application_id: data.application_id,
      action: data.action,
      user_identifier: data.user_identifier,
      details: data.details
    }]);
};
