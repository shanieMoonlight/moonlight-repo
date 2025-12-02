
export const TrustedDeviceCode = `public class TrustedDevice : MyDomainEntity   //Class with Id, DomainEvent handling methods, etc.
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
    // Used by EF Core Serialization
    private TrustedDevice() { }
    #endregion

    //- - - - - - - - - - - - //

    private TrustedDevice(
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
    internal static TrustedDevice Create(
        AppUser user,
        DeviceFingerprint fingerprint,
        DeviceName name,
        UserAgent userAgent,
        IpAddress ipAddress,
        TrustDuration trustDuration)
    {
        DateTime trustedUntil = DateTime.UtcNow.Add(trustDuration.Value);

        var device = new TrustedDevice(
            user,
            fingerprint,
            name,
            userAgent,
            ipAddress,
            trustedUntil);

        device.RaiseDomainEvent(new TrustedDeviceAddedDomainEvent(device.Id, user.Id));

        return device;
    }

    //- - - - - - - - - - - - //

    public TrustedDevice UpdateLastUsed()
    {
        LastUsedDate = DateTime.UtcNow;
        RaiseDomainEvent(new TrustedDeviceUsedDomainEvent(Id, UserId));
        return this;
    }

    //- - - - - - - - - - - - //

    public bool IsExpired()
    {
        var isExpired = TrustedUntil < DateTime.UtcNow;
        if(isExpired)
            RaiseDomainEvent(new TrustedDeviceExpiredDomainEvent(Id, UserId));

        return isExpired;
    }

    //- - - - - - - - - - - - //

    internal TrustedDevice Revoke()
    {
        TrustedUntil = DateTime.UtcNow;
        RaiseDomainEvent(new TrustedDeviceRevokedDomainEvent(Id, UserId));
        return this;
    }

    //- - - - - - - - - - - - //

    internal TrustedDevice ExtendTrust(TimeSpan trustDuration)
    {
        TrustedUntil = DateTime.UtcNow.Add(trustDuration);
        RaiseDomainEvent(new TrustedDeviceExtendedDomainEvent(Id, UserId));
        return this;
    }

    //- - - - - - - - - - - - //

    #region EqualsAndHashCode
    public override bool Equals(object? obj) =>
        obj is TrustedDevice td
        && td.Fingerprint == Fingerprint
        && td.UserId == UserId;

    public override int GetHashCode() => HashCode.Combine(Fingerprint, UserId);
    #endregion

}`;


export const TrustedDevice_Abrv_Code = `public class TrustedDevice : MyDomainEntity   //Class with Id, DomainEvent handling methods, etc.
{
    public Guid UserId { get; private set; }
    public AppUser? User { get; private set; }

    public string Fingerprint { get; private set; }
    
    //More properties...

    //- - - - - - - - - - - - //
    
     protected TrustedDevice(..TrustedDevice parameters ..)
        : base(NewId.NextSequentialGuid()) //Pass Id to base class (We'll need it soon)
    {
      ...
    }

    //- - - - - - - - - - - - //   

   // Internal Factory method to create a TrustedDevice (Can't create outside of Domain Layer)
   internal static TrustedDevice Create(
    AppUser user,
    DeviceFingerprint fingerprint,
    // ... other params
    TrustDuration trustDuration)
    {
        // ... logic ... 

        // We generate the ID internally here, or via the constructor
        var device = new TrustedDevice(
            user,
            fingerprint,
            // ...
            trustedUntil);

        // CRITICAL: We need device.Id right here!
        device.RaiseDomainEvent(new TrustedDeviceAddedDomainEvent(device.Id, user.Id));

        return device;
    }

    //------------------------//   

    //Any other rich domain methods...

}`;
