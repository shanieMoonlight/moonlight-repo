
export const AppUserCode = `public class AppUser : IdentityUser<Guid>, IdDomainEntity
{

    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;
    
    //More properties...

    /// <summary>
    /// Trusted devices for this user
    /// </summary>
    private readonly HashSet<TrustedDevice> _trustedDevices = [];
    public IReadOnlyCollection<TrustedDevice> TrustedDevices =>
        _trustedDevices.ToList().AsReadOnly();


    [NotMapped]
    public string FriendlyName
    {
        get
        {
            if (!string.IsNullOrWhiteSpace(FirstName))
                return FirstName;
            if (!string.IsNullOrWhiteSpace(UserName))
                return UserName!;
            return Email ?? "Unknown name";
        }
    }

    //- - - - - - - - - - - - //

    #region EfCore
    /// <summary>
    // Used by EF Core Serialization
    /// </summary>
    protected AppUser() { }
    #endregion

    protected AppUser(
        EmailAddress email,
        UsernameNullable username,
        PhoneNullable phone,
        FirstNameNullable firstName,
        LastNameNullable lastName)
    {
        UpdateEmailAddress(email);
        UpdatePhone(phone);
        UserName = string.IsNullOrWhiteSpace(username.Value) ? email.Value : username.Value?.Trim();
        FirstName = firstName.Value?.Trim() ?? string.Empty;
        LastName = lastName.Value?.Trim() ?? string.Empty;
        Id = NewId.NextSequentialGuid();
    }

    //- - - - - - - - - - - - //   

    /// <summary>
    /// Create new AppUser. Will default to <see cref="Team.MaxPosition"/> if TeamPosition is null
    /// </summary>
    public static AppUser Create(
        EmailAddress email,
        UsernameNullable username,
        PhoneNullable phone,
        FirstNameNullable firstName,
        LastNameNullable lastName)
    {
        var user = new AppUser(
                email,
                username,
                phone,
                firstName,
                lastName);

        user.RaiseDomainEvent(new UserCreatedDomainEvent(user.Id));

        return user;
    }

    //- - - - - - - - - - - - //   

    public AppUser Update(
        EmailAddress email,
        UsernameNullable username,
        PhoneNullable phone,
        FirstNameNullable firstName,
        LastNameNullable lastName,
        TwoFactorProvider? provider,
        bool twoFactoEnabled)
    {
        FirstName = firstName.Value ?? string.Empty;
        LastName = lastName.Value ?? string.Empty;

        //...Call individual update methods to ensure domain events raised...

        RaiseDomainEvent(new UserUpdatedDomainEvent(Id));

        return this;
    }

    //- - - - - - - - - - - - //  

    //..Other Update Methods..//

    //------------------------//   

    /// <summary>
    /// Trust a device for this user. The validation token guarantees correctness.
    /// </summary>
    public TrustedDevice TrustDevice(
            AppUser user,
            DeviceFingerprint deviceFingerprint,
            DeviceName deviceName,
            UserAgent userAgent,
            IpAddress ipAddress,
            TrustDuration trustDuration)
    {

        var existingDevice = FindTrustedDevice(deviceFingerprint.Value);
        if (existingDevice != null)
        {
            existingDevice.ExtendTrust(trustDuration.Value);
            return existingDevice;
        }

        var device = TrustedDevice.Create(this,
            deviceFingerprint,
            deviceName,
            userAgent,
            ipAddress,
            trustDuration);

        _trustedDevices.Add(device);

        return device;
    }

    //- - - - - - - - - - - - // 

    /// <summary>
    /// Revoke a trusted device. Returns true if device belonged to user and was revoked.
    /// </summary>
    public bool RevokeTrustedDevice(TrustedDevice device)
    {
        var found = _trustedDevices.FirstOrDefault(d => d.Id == device.Id);
        if (found is null)
            return false;

        found.Revoke();
        return true;
    }

    //- - - - - - - - - - - - // 

    /// <summary>
    /// Removes a trusted device form the user. Returns false if device not found (already removed).
    /// </summary>
    public bool DeleteTrustedDevice(TrustedDevice device)
    {
        var found = _trustedDevices.FirstOrDefault(d => d.Id == device.Id);
        if (found is null)
            return false;

        _trustedDevices.Remove(found);
        return true;
    }

    //- - - - - - - - - - - - // 

    /// <summary>
    /// Find trusted device by fingerprint.
    /// </summary>
    public TrustedDevice? FindTrustedDevice(string deviceFingerprint)
        => _trustedDevices.FirstOrDefault(d => d.Fingerprint == deviceFingerprint);

    //- - - - - - - - - - - - // 

    /// <summary>
    /// Find trusted device by deviceId.
    /// </summary>
    public TrustedDevice? FindTrustedDevice(Guid deviceId)
        => _trustedDevices.FirstOrDefault(d => d.Id == deviceId);


}`;



export const AppUser_Abrv_Code = `public class AppUser : MyDomainEntity   //Class with Id, DomainEvent handling methods, etc.
{

    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;
    
    //More properties...

    /// <summary>
    /// Trusted devices for this user
    /// </summary>
    private readonly HashSet<TrustedDevice> _trustedDevices = [];
    public IReadOnlyCollection<TrustedDevice> TrustedDevices =>
        _trustedDevices.ToList().AsReadOnly();

    //- - - - - - - - - - - - //
    
     protected AppUser(..AppUser parameters..)
        : base(NewId.NextSequentialGuid()) //Pass Id to base class 
    {
      ...
    }

    //Any other private constructors...

    //- - - - - - - - - - - - //   

    //Public factory methods. Create, Update etc.

    //------------------------//   

    /// <summary>
    /// Factory method to trust a device for this user. 
    /// Single point of entry to ensure business rules are enforced.
    /// This will call the internal TrustedDevice.Create factory method. 
    /// So noone outside of the Domain can create TrustedDevice instances directly.
    /// </summary>
    public TrustedDevice TrustDevice(
            AppUser user,
            DeviceFingerprint deviceFingerprint,
            DeviceName deviceName,
            UserAgent userAgent,
            IpAddress ipAddress,
            TrustDuration trustDuration)
    {
        // 1. Check if it already exists
        var existingDevice = FindTrustedDevice(deviceFingerprint.Value);
        if (existingDevice != null)
        {
            existingDevice.ExtendTrust(trustDuration.Value);
            return existingDevice;
        }

        // 2. If not, ask the Factory to create one
        var device = TrustedDevice.Create(this,
            deviceFingerprint,
            deviceName,
            userAgent,
            ipAddress,
            trustDuration);

        // 3. Add it to our internal collection
        _trustedDevices.Add(device);

        return device;
    }

    //------------------------//   

    //Any other rich domain methods...
}`;


