
export const AppUserCode = `public class AppUser0 : IdentityUser<Guid>, IIdDomainEventEntity, IIdAuditableDomainEntity
{

    public string FirstName { get; private set; } = string.Empty;

    public string LastName { get; private set; } = string.Empty;


    /// <summary>
    /// How will 2 factor be verified
    /// </summary>
    public TwoFactorProvider TwoFactorProvider { get; private set; } = TwoFactorProvider.Email; //Everyone has an email


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
    /// Used by EfCore
    /// </summary>
    protected AppUser0() { }

    #endregion

    protected AppUser0(
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
    /// Create new AppUser0. Will default to <see cref="Team.MaxPosition"/> if TeamPosition is null
    /// </summary>
    public static AppUser0 Create(
        EmailAddress email,
        UsernameNullable username,
        PhoneNullable phone,
        FirstNameNullable firstName,
        LastNameNullable lastName)
    {
        var user = new AppUser0(
                email,
                username,
                phone,
                firstName,
                lastName);

        user.RaiseDomainEvent(new UserCreatedDomainEvent(user.Id));

        return user;
    }

    //- - - - - - - - - - - - //   

    public AppUser0 Update(
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



export const TrustedDeviceCode = `public class TrustedDevice0 : IdDomainEntity
{
    public Guid UserId { get; private set; }
    public AppUser? User { get; private set; }

    public string Fingerprint { get; private set; }
    public string? Name { get; private set; }
    public string UserAgent { get; private set; }
    public string IpAddress { get; private set; }

    public DateTime TrustedUntil { get; private set; }

    public DateTime LastUsedDate { get; private set; }


    /// <summary>
    /// Trusted devices for this user
    /// </summary>
    public IReadOnlyCollection<IdRefreshToken>? IdRefreshTokens { get; private set; }



    #region EfCoreCtor
    // Used by EF Core
#pragma warning disable CS8618
    private TrustedDevice0() { }
#pragma warning restore CS8618
    #endregion

    //- - - - - - - - - - - - //

    private TrustedDevice0(
        AppUser user,
        DeviceFingerprint fingerprint,
        DeviceName name,
        UserAgent userAgent,
        IpAddress ipAddress,
        DateTime trustedUntil)
        : base(NewId.NextSequentialGuid())
    {
        UserId = user.Id;
        User = user;
        Fingerprint = fingerprint.Value;
        Name = name.Value;
        UserAgent = userAgent.Value;
        TrustedUntil = trustedUntil;
        LastUsedDate = DateTime.UtcNow;
        IpAddress = ipAddress.Value;
    }

    //- - - - - - - - - - - - //

    // New overload accepting TrustDuration
    internal static TrustedDevice0 Create(
        AppUser user,
        DeviceFingerprint fingerprint,
        DeviceName name,
        UserAgent userAgent,
        IpAddress ipAddress,
        TrustDuration trustDuration)
    {
        DateTime trustedUntil = DateTime.UtcNow.Add(trustDuration.Value);

        var device = new TrustedDevice0(
            user,
            fingerprint,
            name,
            userAgent,
            ipAddress,
            trustedUntil);

        device.RaiseDomainEvent(new TrustedDevice0AddedDomainEvent(device.Id, user.Id));

        return device;
    }

    //- - - - - - - - - - - - //

    public TrustedDevice0 UpdateLastUsed()
    {
        LastUsedDate = DateTime.UtcNow;
        RaiseDomainEvent(new TrustedDevice0UsedDomainEvent(Id, UserId));
        return this;
    }

    //- - - - - - - - - - - - //

    public bool IsExpired()
    {
        var isExpired = TrustedUntil < DateTime.UtcNow;
        if(isExpired)
            RaiseDomainEvent(new TrustedDevice0ExpiredDomainEvent(Id, UserId));

        return isExpired;
    }

    //- - - - - - - - - - - - //

    internal TrustedDevice0 Revoke()
    {
        TrustedUntil = DateTime.UtcNow;
        RaiseDomainEvent(new TrustedDevice0RevokedDomainEvent(Id, UserId));
        return this;
    }

    //- - - - - - - - - - - - //

    internal TrustedDevice0 ExtendTrust(TimeSpan trustDuration)
    {
        TrustedUntil = DateTime.UtcNow.Add(trustDuration);
        RaiseDomainEvent(new TrustedDevice0ExtendedDomainEvent(Id, UserId));
        return this;
    }

    //- - - - - - - - - - - - //

    #region EqualsAndHashCode
    public override bool Equals(object? obj) =>
        obj is TrustedDevice0 td
        && td.Fingerprint == Fingerprint
        && td.UserId == UserId;

    public override int GetHashCode() => HashCode.Combine(Fingerprint, UserId);
    #endregion

}`;
