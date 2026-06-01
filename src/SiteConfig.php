<?php

declare(strict_types=1);

namespace Phalanx\Site;

final class SiteConfig
{
    public function __construct(
        private(set) string $siteUrl,
    ) {}

    public static function fromContext(array $context): self
    {
        return new self(
            siteUrl: $context['SITE_URL'] ?? 'http://localhost:8091',
        );
    }
}
